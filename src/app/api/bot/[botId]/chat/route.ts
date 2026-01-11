import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { z } from 'zod';
import { getGoogleModel, FLASH_MODEL } from '@/lib/ai/google';
import { getAdminDb } from '@/server/firebase-admin';
import { formatProjectContext, getRelevantProjects } from '@/server/inventory';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { enforceUsageLimit, PlanLimitError } from '@/lib/server/billing';

const requestSchema = z.object({
  message: z.string().min(1),
  history: z.array(z.object({
    role: z.enum(['user', 'agent']),
    text: z.string(),
  })).optional(),
  siteId: z.string().optional(),
  context: z.string().optional(),
});

const rateLimits = new Map<string, { count: number; expiresAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

function consumeRateLimit(key: string) {
  const now = Date.now();
  const bucket = rateLimits.get(key);
  if (!bucket || bucket.expiresAt < now) {
    rateLimits.set(key, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX) {
    return false;
  }
  bucket.count += 1;
  return true;
}

export async function POST(req: NextRequest, { params: paramsPromise }: { params: Promise<{ botId: string }> }) {
  try {
    const params = await paramsPromise;
    const { tenantId } = await requireRole(req, ALL_ROLES);
    await enforceUsageLimit(getAdminDb(), tenantId, 'ai_conversations', 1);
    const ip = req.headers.get('x-forwarded-for') || 'anon';
    if (!consumeRateLimit(`${params.botId}:${ip}`)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();
    const payload = requestSchema.parse(body);

    const historyText = (payload.history || [])
      .map((entry) => `${entry.role === 'user' ? 'User' : 'Agent'}: ${entry.text}`)
      .join('\n');

    const relevantProjects = await getRelevantProjects(payload.message, payload.context, 8);
    const projectContext = relevantProjects.length
      ? `\nRelevant listings:\n${relevantProjects.map(formatProjectContext).join('\n')}`
      : '';

    const prompt = `
Context: ${payload.context || 'web_widget'}.
Use simple, non-technical language. If details are missing, say so and offer next steps.
Ask one question at a time. If the buyer shows interest and contact details are missing, ask for name and WhatsApp or email.
${projectContext}

Conversation so far:
${historyText}

User (${params.botId}): ${payload.message}
`;

    let reply = '';
    try {
      const { text } = await generateText({
        model: getGoogleModel(FLASH_MODEL),
        system:
          "You are EntreSite's AI sales concierge. Be concise, cite Dubai market data when possible, and always steer toward capturing name/contact if missing.",
        prompt,
      });
      reply = text;
    } catch (error) {
      console.error('[bot/chat] ai error', error);
      const fallbackList = relevantProjects.slice(0, 3).map(formatProjectContext).join('\n');
      reply = fallbackList
        ? `Here are a few options I can share right now:\n${fallbackList}\nTell me your budget and preferred area, and I will narrow it down.`
        : 'I can help with UAE projects, pricing ranges, and next steps. What area and budget should I focus on?';
    }

    // Log to Firestore for monitoring
    try {
      const db = getAdminDb();
      await db.collection('bot_events').add({
        botId: params.botId,
        tenantId,
        siteId: payload.siteId || null,
        userMessage: payload.message,
        agentReply: reply,
        createdAt: new Date().toISOString(),
        context: payload.context || 'web_widget',
      });
    } catch (logError) {
      console.error('[bot] failed to log event', logError);
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('[bot/chat] error', error);
    if (error instanceof PlanLimitError) {
      return NextResponse.json(
        { error: 'Plan limit reached', metric: error.metric, limit: error.limit },
        { status: 402 }
      );
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
