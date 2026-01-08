import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { z } from 'zod';
import { getGoogleModel, FLASH_MODEL } from '@/lib/ai/google';
import { formatProjectContext, getRelevantProjects } from '@/server/inventory';

const requestSchema = z.object({
  message: z.string().min(1),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'agent']),
        text: z.string(),
      })
    )
    .optional(),
  context: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = requestSchema.parse(body);

    const historyText = (payload.history || [])
      .map((entry) => `${entry.role === 'user' ? 'Investor' : 'Agent'}: ${entry.text}`)
      .join('\n');

    const relevantProjects = await getRelevantProjects(payload.message, payload.context, 8);
    const projectContext = relevantProjects.length
      ? `\nRelevant listings:\n${relevantProjects.map(formatProjectContext).join('\n')}`
      : '';

    const prompt = `
Role & Context:
${payload.context || 'Entrestate chat assistant for UAE real estate teams.'}

You are a UAE real estate advisor who explains things clearly and avoids technical jargon.
Use the listing context below when available and keep answers concise.
If asked about Dubai/UAE investment topics (fees, visas, payment plans, ROI, financing), give high-level guidance and say details should be confirmed with the broker.
If you mention pricing or returns, note they are estimates.
If you are unsure, say so and offer a next step (brochure, viewing, or a call).
${projectContext}

Conversation History:
${historyText}

Investor: ${payload.message}
Agent:
`;

    const { text } = await generateText({
      model: getGoogleModel(FLASH_MODEL),
      system:
        'You are the Entrestate real estate assistant. Use a friendly, professional tone. Never sound robotic.',
      prompt,
    });

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('[bot/preview/chat] error', error);
    return NextResponse.json({ reply: "I'm analyzing that project's latest data. How else can I help?" });
  }
}
