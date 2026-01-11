import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

const requestSchema = z.object({
  topic: z.string().min(1),
  context: z.string().optional(),
  maxChars: z.number().optional(),
});

const API_KEY =
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.Gemini_api_key;

const google = API_KEY ? createGoogleGenerativeAI({ apiKey: API_KEY }) : null;
const MODEL_ID = 'gemini-1.5-flash';

const stripNonAscii = (value: string) => value.replace(/[^\x20-\x7E]/g, '').trim();

const clampLength = (value: string, maxChars: number) => {
  if (value.length <= maxChars) return value;
  return value.slice(0, maxChars).trim();
};

export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ALL_ROLES);
    if (!google) {
      return NextResponse.json({ error: 'AI provider is not configured' }, { status: 500 });
    }

    const payload = requestSchema.parse(await req.json());
    const maxChars = payload.maxChars && payload.maxChars > 0 ? payload.maxChars : 260;

    const { text } = await generateText({
      model: google(MODEL_ID) as any,
      system:
        'You write SMS messages for UAE real estate agents. Keep it concise, professional, and clear. No emojis, no hashtags, no jargon.',
      prompt: `Write one SMS about: ${payload.topic}. Context: ${payload.context || 'UAE real estate listings'}. Include a simple call to action.`,
    });

    const sanitized = stripNonAscii(text.replace(/\s+/g, ' '));
    const message = clampLength(sanitized, maxChars);

    return NextResponse.json({ message });
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Generation failed', details: error?.message }, { status: 500 });
  }
}
