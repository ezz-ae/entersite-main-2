import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { z } from 'zod';
import { getGoogleModel, PRO_MODEL } from '@/lib/ai/google';
import { mainSystemPrompt } from '@/config/prompts';

const requestSchema = z.object({
  message: z.string().min(1),
  history: z.array(z.object({
    role: z.enum(['user', 'agent']),
    text: z.string(),
  })).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history: incomingHistory } = requestSchema.parse(body);

    const history = (incomingHistory || []).map(entry => ({
      role: entry.role === 'agent' ? 'assistant' as const : 'user' as const,
      content: entry.text,
    }));

    const messages = [
      ...history,
      { role: 'user' as const, content: message },
    ];

    const { text } = await generateText({
      model: getGoogleModel(PRO_MODEL),
      system: mainSystemPrompt,
      messages,
    });

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('[bot/main/chat] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ reply: "Invalid request payload.", error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ reply: "My apologies, I'm experiencing a technical issue and can't respond right now. Please try again in a moment." }, { status: 500 });
  }
}
