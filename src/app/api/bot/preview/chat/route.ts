import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateChatText } from '@/lib/ai/chat';
import { formatProjectContext, getRelevantProjects } from '@/server/inventory';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { getPublishedSite } from '@/server/publish-service';
import { getAdminDb } from '@/server/firebase-admin';
import { getSubscription } from '@/lib/server/billing';
import { hasChatAgent } from '@/lib/chat-agent';
import { getChatKnowledgeContext } from '@/server/chat-context';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

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
  siteId: z.string().optional(),
});

const SOFT_LOCK_REPLY =
  'Assistant paused on this page. Your current plan supports one live assistant. Upgrade to activate it on multiple pages.';

type SiteDoc = QueryDocumentSnapshot;

const INTENT_REGEX = /\b(price|budget|cost|area|location|where|buy|rent|project|launch|payment|plan|viewing|brochure|availability|shop|shops|retail|commercial|office|warehouse|studio|villa|townhouse|invest|investment|roi|return)\b/i;

function toMillis(value: any, fallback = 0) {
  if (!value) return fallback;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  if (value.toMillis) return value.toMillis();
  if (value.toDate) return value.toDate().getTime();
  return fallback;
}

function getSiteSortKey(doc: SiteDoc) {
  const data = doc.data() || {};
  const createdFallback = doc.createTime?.toMillis ? doc.createTime.toMillis() : 0;
  return toMillis(data.lastPublishedAt, toMillis(data.createdAt, createdFallback));
}

async function isChatSoftLocked(siteKey: string) {
  const site = await getPublishedSite(siteKey);
  if (!site?.tenantId) {
    return { locked: false };
  }
  if (!hasChatAgent(site.blocks)) {
    return { locked: false };
  }

  const db = getAdminDb();
  const subscription = await getSubscription(db, site.tenantId);
  const isPaid = subscription.status === 'active' || subscription.creditBalance > 0;
  if (isPaid) {
    return { locked: false };
  }

  const snapshot = await db
    .collection('sites')
    .where('tenantId', '==', site.tenantId)
    .where('published', '==', true)
    .get();

  const chatSites = snapshot.docs.filter((doc) => {
    const data = doc.data() || {};
    if (typeof data.chatAgentEnabled === 'boolean') {
      return data.chatAgentEnabled;
    }
    return hasChatAgent(data.blocks);
  });

  if (chatSites.length <= 1) {
    return { locked: false };
  }

  let primary = chatSites[0];
  let primaryKey = getSiteSortKey(primary);
  for (const doc of chatSites.slice(1)) {
    const key = getSiteSortKey(doc);
    if (key < primaryKey) {
      primary = doc;
      primaryKey = key;
    }
  }

  if (primary.id !== site.id) {
    return { locked: true };
  }

  return { locked: false };
}

function shouldUseListings(message: string) {
  const trimmed = message.trim();
  if (!trimmed) return false;
  return INTENT_REGEX.test(trimmed);
}

export async function POST(req: NextRequest) {
  // Public marketing preview: no auth, no persistence, strict rate limiting.
  let payload: z.infer<typeof requestSchema> | null = null;
  try {
    const ip = getRequestIp(req);
    if (!(await enforceRateLimit(`bot:preview:${ip}`, 20, 60_000))) {
      return NextResponse.json({ reply: 'Rate limit exceeded' }, { status: 429 });
    }
    const body = await req.json();
    payload = requestSchema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ reply: 'Invalid request payload.', error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ reply: 'Invalid request payload.' }, { status: 400 });
  }

  const siteKey = payload.siteId?.trim();
  if (siteKey) {
    try {
      const softLock = await isChatSoftLocked(siteKey);
      if (softLock.locked) {
        return NextResponse.json({ reply: SOFT_LOCK_REPLY, softLock: true });
      }
    } catch (error) {
      console.error('[bot/preview/chat] soft lock check failed', error);
    }
  }

  const includeListings = shouldUseListings(payload.message);

  const historyText = (payload.history || [])
    .map((entry) => `${entry.role === 'user' ? 'Investor' : 'Agent'}: ${entry.text}`)
    .join('\n');

  let knowledgeContext = '';
  try {
    knowledgeContext = await getChatKnowledgeContext();
  } catch (error) {
    console.error('[bot/preview/chat] knowledge context failed', error);
  }

  let relevantProjects: Awaited<ReturnType<typeof getRelevantProjects>> = [];
  try {
    if (includeListings) {
      relevantProjects = await getRelevantProjects(payload.message, payload.context, 8);
    }
  } catch (error) {
    console.error('[bot/preview/chat] inventory context failed', error);
  }

  const projectContext = relevantProjects.length
    ? `\nRelevant listings:\n${relevantProjects.map(formatProjectContext).join('\n')}`
    : '';

  const prompt = `
Platform & Inventory Reference:
${knowledgeContext}

Role & Context:
${payload.context || 'Entrestate chat assistant for UAE real estate teams.'}

You are a UAE real estate advisor who explains things clearly and avoids technical jargon.
Always respond in the user's language. Supported: Arabic, English, Russian, Chinese. If unsure, use English.
Use the listing context below when available and keep answers concise.
If asked about Dubai/UAE investment topics (fees, visas, payment plans, ROI, financing), give high-level guidance and say details should be confirmed with the broker.
If you mention pricing or returns, note they are estimates.
Answer investor questions clearly, including general UAE/Dubai questions (like fees, visas, or weather) with a brief, helpful response.
If you are unsure, say so and offer a next step (brochure, viewing, or a call).
Ask one question at a time. If the buyer shows interest and contact details are missing, ask for name and WhatsApp or email.
${projectContext}

Conversation History:
${historyText}

Investor: ${payload.message}
Agent:
`;

  try {
    const text = await generateChatText({
      system:
        'You are the Entrestate real estate assistant. Use a friendly, professional tone. Never sound robotic.',
      prompt,
      googleModel: 'gemini-2.5-flash',
    });
    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('[bot/preview/chat] error', error);
    if (!includeListings) {
      return NextResponse.json({
        reply: "I can help with UAE listings, pricing ranges, and investor questions. What would you like to know?",
      });
    }
    const fallbackList = relevantProjects.slice(0, 3).map(formatProjectContext).join('\n');
    const fallbackReply = fallbackList
      ? `Here are a few options I can share right now:\n${fallbackList}\nTell me your budget and preferred area, and I will narrow it down.`
      : "I can help with UAE projects, pricing ranges, and next steps. What area and budget should I focus on?";
    return NextResponse.json({ reply: fallbackReply });
  }
}
