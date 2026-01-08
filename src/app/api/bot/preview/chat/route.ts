import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { z } from 'zod';
import { getGoogleModel, FLASH_MODEL } from '@/lib/ai/google';

const requestSchema = z.object({
  message: z.string().min(1),
  history: z.array(z.object({
    role: z.enum(['user', 'agent']),
    text: z.string(),
  })).optional(),
  context: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = requestSchema.parse(body);

    const historyText = (payload.history || [])
      .map((entry) => `${entry.role === 'user' ? 'Investor' : 'Agent'}: ${entry.text}`)
      .join('\n');

    const prompt = `
Character Profile & Context:
${payload.context}

You are an expert real estate advisor in the UAE. 
You are humanized, professional, and use deep market knowledge.
Mention specific ROI, area trends, and developer details when relevant.

Conversation History:
${historyText}

Investor: ${payload.message}
Agent:
`;

    const { text } = await generateText({
      model: getGoogleModel(FLASH_MODEL),
      system: "You are the Entrestate AI Real Estate Expert. Use a conversational, high-end concierge tone. Never sound like a generic bot.",
      prompt,
    });

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('[bot/preview/chat] error', error);
    return NextResponse.json({ reply: "I'm analyzing that project's latest data. How else can I help?" });
  }
}
