import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { z } from 'zod';
import { getGoogleModel, PRO_MODEL, FLASH_MODEL } from '@/lib/ai/google';
import { mainSystemPrompt } from '@/config/prompts';
import { formatProjectContext, getRelevantProjects } from '@/server/inventory';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { enforceUsageLimit, PlanLimitError } from '@/lib/server/billing';
import { getAdminDb } from '@/server/firebase-admin';

const requestSchema = z.object({
  message: z.string().min(1),
  history: z.array(z.object({
    role: z.enum(['user', 'agent']),
    text: z.string(),
  })).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    await enforceUsageLimit(getAdminDb(), tenantId, 'ai_conversations', 1);
    const body = await req.json();
    const { message, history: incomingHistory } = requestSchema.parse(body);

    const historyText = (incomingHistory || [])
      .map((entry) => `${entry.role === 'user' ? 'Client' : 'Agent'}: ${entry.text}`)
      .join('\n');

    const relevantProjects = await getRelevantProjects(message, historyText, 8);
    const projectContext = relevantProjects.length
      ? `\nRelevant listings:\n${relevantProjects.map(formatProjectContext).join('\n')}`
      : '';

    const prompt = `
Role & Context:
You are Entrestate's real estate assistant for UAE brokers.
Speak in simple, non-technical language and keep answers concise.
Use the listing context below when available.
If asked about Dubai/UAE investment topics (fees, visas, payment plans, ROI, financing), give high-level guidance and say details should be confirmed with the broker.
If you mention pricing or returns, note they are estimates.
If you are unsure, say so and offer a next step (brochure, viewing, or a call).
Ask one question at a time. If the buyer shows interest and contact details are missing, ask for name and WhatsApp or email.
${projectContext}

Conversation History:
${historyText}

Client: ${message}
Agent:
`;

    let reply = '';
    try {
      const { text } = await generateText({
        model: getGoogleModel(PRO_MODEL),
        system: `${mainSystemPrompt}\nAlways be clear, helpful, and broker-friendly.`,
        prompt,
      });
      reply = text;
    } catch (error) {
      console.error('[bot/main/chat] pro model error', error);
      try {
        const { text } = await generateText({
          model: getGoogleModel(FLASH_MODEL),
          system: `${mainSystemPrompt}\nAlways be clear, helpful, and broker-friendly.`,
          prompt,
        });
        reply = text;
      } catch (fallbackError) {
        console.error('[bot/main/chat] flash model error', fallbackError);
        const fallbackList = relevantProjects.slice(0, 3).map(formatProjectContext).join('\n');
        reply = fallbackList
          ? `Here are a few options I can share right now:\n${fallbackList}\nTell me your budget and preferred area, and I will narrow it down.`
          : 'I can help with UAE projects, pricing ranges, and next steps. What area and budget should I focus on?';
      }
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('[bot/main/chat] error', error);
    if (error instanceof PlanLimitError) {
      return NextResponse.json(
        { reply: 'Plan limit reached', metric: error.metric, limit: error.limit },
        { status: 402 }
      );
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ reply: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ reply: "Forbidden" }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ reply: "Invalid request payload.", error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ reply: "My apologies, I'm experiencing a technical issue and can't respond right now. Please try again in a moment." }, { status: 500 });
  }
}
