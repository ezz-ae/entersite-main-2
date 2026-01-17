import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateChatText } from '@/lib/ai/chat';
import { FLASH_MODEL } from '@/lib/ai/google';
import { getAdminDb } from '@/server/firebase-admin';
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
import { getChatKnowledgeContext } from '@/server/chat-context';

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
    enforceSameOrigin(req);
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

    let agentContext = '';
    try {
      const [profile, events] = await Promise.all([
        getAgentProfile(tenantId),
        listAgentEvents(tenantId, 20),
      ]);
      agentContext = buildAgentContext(profile, getActiveAgentEvents(events));
    } catch (error) {
      console.warn('[bot/chat] agent context failed', error);
    }

    let knowledgeContext = '';
    try {
      knowledgeContext = await getChatKnowledgeContext();
    } catch (error) {
      console.error('[bot/chat] knowledge context failed', error);
    }

    const relevantProjects = await getRelevantProjects(payload.message, payload.context, 8);
    const projectContext = relevantProjects.length
      ? `\nRelevant listings:\n${relevantProjects.map(formatProjectContext).join('\n')}`
      : '';

    const prompt = `
Platform & Inventory Reference:
${knowledgeContext}

Context: ${payload.context || 'web_widget'}.
Always respond in the user's language. Supported: Arabic, English, Russian, Chinese. If unsure, use English.
Use simple, non-technical language. If details are missing, say so and offer next steps.
Follow Agent Context response style: short = 1-2 sentences, balanced = 2-4, detailed = 4-6 (bullets ok). Depth level: basic = plain facts, practical = actionable guidance, deep = insightful but concise.
Ask one question at a time. If the buyer shows interest and contact details are missing, ask for name and WhatsApp or email.
If the primary goal is Collect WhatsApp or Collect phone number, deliver helpful info first, then ask once.
If the user asks how to contact you, use the contact details from Agent Context. If contact info is missing, ask for WhatsApp and promise a callback.
If Company info is missing and the user asks about the company, say: "I don't have company info yet."
If the user pushes back on the sales approach, soften by one level and stay helpful.
If a takeover trigger is met, suggest a handoff according to the Agent Context method.
If the user mentions a location/project that matches an active event, highlight the event and CTA, following the urgency tone.
${projectContext}
${agentContext ? `\nAgent Context:\n${agentContext}` : ''}

Conversation so far:
${historyText}

User (${params.botId}): ${payload.message}
`;

    let reply = '';
    try {
      reply = await generateChatText({
        system:
          "You are EntreSite's Smart sales concierge. Be concise, cite Dubai market data when possible, and always steer toward capturing name/contact if missing.",
        prompt,
        googleModel: FLASH_MODEL,
      });
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
        { reply: 'Plan limit reached', error: planLimitErrorResponse(error) },
        { status: 402 },
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
