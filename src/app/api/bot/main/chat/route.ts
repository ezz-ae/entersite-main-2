import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateChatText } from '@/lib/ai/chat';
import { PRO_MODEL, FLASH_MODEL } from '@/lib/ai/google';
import { mainSystemPrompt } from '@/config/prompts';
import { formatProjectContext, getRelevantProjects } from '@/server/inventory';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';
import { getAgentProfile } from '@/server/agent/agent-profile';
import { listAgentEvents } from '@/server/agent/agent-events';
import { buildAgentContext, getActiveAgentEvents } from '@/server/agent/agent-context';
import {
  enforceUsageLimit,
  PlanLimitError,
  planLimitErrorResponse,
} from '@/lib/server/billing';
import { getAdminDb } from '@/server/firebase-admin';
import { getChatKnowledgeContext } from '@/server/chat-context';

const requestSchema = z.object({
  message: z.string().min(1),
  history: z.array(z.object({
    role: z.enum(['user', 'agent']),
    text: z.string(),
  })).optional(),
});

export async function POST(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const { tenantId } = await requireRole(req, ALL_ROLES);
    await enforceUsageLimit(getAdminDb(), tenantId, 'ai_conversations', 1);
    const body = await req.json();
    const { message, history: incomingHistory } = requestSchema.parse(body);

    const historyText = (incomingHistory || [])
      .map((entry) => `${entry.role === 'user' ? 'Client' : 'Agent'}: ${entry.text}`)
      .join('\n');

    let agentContext = '';
    try {
      const [profile, events] = await Promise.all([
        getAgentProfile(tenantId),
        listAgentEvents(tenantId, 20),
      ]);
      agentContext = buildAgentContext(profile, getActiveAgentEvents(events));
    } catch (error) {
      console.warn('[bot/main/chat] agent context failed', error);
    }

    let knowledgeContext = '';
    try {
      knowledgeContext = await getChatKnowledgeContext();
    } catch (error) {
      console.error('[bot/main/chat] knowledge context failed', error);
    }

    const relevantProjects = await getRelevantProjects(message, historyText, 8);
    const projectContext = relevantProjects.length
      ? `\nRelevant listings:\n${relevantProjects.map(formatProjectContext).join('\n')}`
      : '';

    const prompt = `
Platform & Inventory Reference:
${knowledgeContext}

Role & Context:
You are Entrestate's real estate assistant for UAE brokers.
Always respond in the user's language. Supported: Arabic, English, Russian, Chinese. If unsure, use English.
Speak in simple, non-technical language and keep answers concise.
Follow Agent Context response style: short = 1-2 sentences, balanced = 2-4, detailed = 4-6 (bullets ok). Depth level: basic = plain facts, practical = actionable guidance, deep = insightful but concise.
Use the listing context below when available.
If asked about Dubai/UAE investment topics (fees, visas, payment plans, ROI, financing), give high-level guidance and say details should be confirmed with the broker.
If you mention pricing or returns, note they are estimates.
If you are unsure, say so and offer a next step (brochure, viewing, or a call).
Ask one question at a time. If the buyer shows interest and contact details are missing, ask for name and WhatsApp or email.
If the primary goal is Collect WhatsApp or Collect phone number, deliver helpful info first, then ask once.
If the user asks how to contact you, use the contact details from Agent Context. If contact info is missing, ask for WhatsApp and promise a callback.
If Company info is missing and the user asks about the company, say: "I don't have company info yet."
If the user pushes back on the sales approach, soften by one level and stay helpful.
If a takeover trigger is met, suggest a handoff according to the Agent Context method.
If the user mentions a location/project that matches an active event, highlight the event and CTA, following the urgency tone.
${projectContext}
${agentContext ? `\nAgent Context:\n${agentContext}` : ''}

Conversation History:
${historyText}

Client: ${message}
Agent:
`;

    let reply = '';
    try {
      reply = await generateChatText({
        system: `${mainSystemPrompt}\nAlways be clear, helpful, and broker-friendly.`,
        prompt,
        googleModel: PRO_MODEL,
      });
    } catch (error) {
      console.error('[bot/main/chat] pro model error', error);
      try {
        reply = await generateChatText({
          system: `${mainSystemPrompt}\nAlways be clear, helpful, and broker-friendly.`,
          prompt,
          googleModel: FLASH_MODEL,
        });
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
        { reply: 'Plan limit reached', error: planLimitErrorResponse(error) },
        { status: 402 },
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
