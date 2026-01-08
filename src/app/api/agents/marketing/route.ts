import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { z } from 'zod';
import { getGoogleModel, PRO_MODEL } from '@/lib/ai/google';
import { requireAuth, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { getAdminDb } from '@/server/firebase-admin';

const agentResponseSchema = z.object({
  siteType: z.enum(['roadshow', 'developer-focus', 'partner-launch', 'full-company', 'freelancer', 'map-focused', 'ads-launch', 'agent-portfolio', 'custom']).optional(),
  pageTitle: z.string().optional(),
  projectName: z.string().optional(),
  developerName: z.string().optional(),
  locationCity: z.string().optional(),
  brandColor: z.string().optional(),
  logoUrl: z.string().optional(),
  adCampaignConfig: z.object({
    budget: z.number().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
  blocks: z.array(z.object({
    type: z.string(),
    data: z.record(z.any()).optional()
  })).optional(),
});

const responseSchema = z.object({
  summary: z.string(),
  configuration: agentResponseSchema,
});

const rateLimitStore = new Map<string, { count: number; expiresAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

function consumeRateLimit(key: string) {
  const now = Date.now();
  const bucket = rateLimitStore.get(key);
  if (!bucket || bucket.expiresAt < now) {
    rateLimitStore.set(key, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX) {
    return false;
  }
  bucket.count += 1;
  return true;
}

const requestSchema = z.object({
  prompt: z.string().min(3),
  audience: z.string().optional(),
  context: z.record(z.any()).optional(),
});

export async function POST(req: NextRequest) {
    try {
        const user = await requireAuth(req);
        const ip = req.headers.get('x-forwarded-for') || 'anonymous';
        if (!consumeRateLimit(ip)) {
            return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }

        const body = await req.json();
        const payload = requestSchema.parse(body);

        const { object } = await generateObject({
            model: getGoogleModel(PRO_MODEL),
            schema: responseSchema,
            system: "You are the EntreSite Marketing Architect. Produce block structures and campaign hints ready for production use.",
            prompt: `Brief: ${payload.prompt}. Audience: ${payload.audience || 'general real estate buyers'}. Context: ${JSON.stringify(payload.context || {})}`,
        });

        const result = { 
          text: object.summary,
          parameters: object.configuration,
          isEndInteraction: true
        };

        try {
            const db = getAdminDb();
            await db
              .collection('tenants')
              .doc(user.uid || 'public')
              .collection('marketing_plans')
              .add({
                  prompt: payload.prompt,
                  audience: payload.audience || null,
                  context: payload.context || null,
                  response: result,
                  createdAt: new Date().toISOString(),
              });
        } catch (logError) {
            console.error('[agents/marketing] failed to store plan', logError);
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('[agents/marketing] error', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        if (error instanceof UnauthorizedError) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error instanceof ForbiddenError) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        return NextResponse.json({ error: 'Failed to generate marketing plan' }, { status: 500 });
    }
}
