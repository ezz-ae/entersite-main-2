import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import type { Firestore } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import { CAP } from '@/lib/capabilities';
import { sendLeadEmail } from '@/lib/notifications/email';
import { sendLeadSMS } from '@/lib/notifications/sms';
import { upsertHubspotLead } from '@/lib/integrations/hubspot-leads';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { createApiLogger } from '@/lib/logger';
import {
  enforceUsageLimit,
  PlanLimitError,
  planLimitErrorResponse,
} from '@/lib/server/billing';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { getPublishedSite } from '@/server/publish-service';
import { writeAudienceEvent } from '@/server/audience/write-event';
import { getCampaign } from '@/server/campaigns/campaign-store';
import { createOrResetSenderRun } from '@/server/sender/sender-store';
import { DEFAULT_LEAD_DIRECTION } from '@/lib/lead-direction';

const NOTIFY_EMAIL_TO = process.env.NOTIFY_EMAIL_TO;
const NOTIFY_SMS_TO = process.env.NOTIFY_SMS_TO;

const payloadSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
  project: z.string().optional(),
  projectId: z.string().optional(),
  pageSlug: z.string().optional(),
  honeypot: z.string().optional(),
  context: z.record(z.any()).optional(),
  attribution: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  siteId: z.string().optional(),
  // Optional campaign linkage (usually provided via attribution captured from query params)
  campaignDocId: z.string().optional(),
});

type LeadPayload = z.infer<typeof payloadSchema>;

const parseEmailList = (value?: string | null) => {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

async function resolvePublicTenant(payload: LeadPayload) {
  const siteKey =
    payload.siteId ||
    payload.pageSlug ||
    (payload.metadata?.pageSlug as string | undefined) ||
    (payload.context?.pageSlug as string | undefined);
  if (!siteKey) return null;
  const publishedSite = await getPublishedSite(siteKey);
  if (!publishedSite?.published) return null;
  const tenantId = publishedSite.tenantId || null;
  if (!tenantId) return null;
  return { tenantId, siteId: publishedSite.id };
}

async function resolveCampaignId(db: Firestore, tenantId: string, payload: LeadPayload) {
  const attribution = (payload.attribution || {}) as Record<string, any>;
  const metadata = (payload.metadata || {}) as Record<string, any>;

  const candidate =
    (attribution.campaignDocId as string | undefined) ||
    (payload.campaignDocId as string | undefined) ||
    (attribution.campaignId as string | undefined) ||
    (metadata.campaignDocId as string | undefined) ||
    (metadata.campaignId as string | undefined);

  const campaignId = candidate ? String(candidate).trim() : '';
  if (!campaignId) return null;

  const snap = await db.collection('campaigns').doc(campaignId).get();
  if (!snap.exists) {
    // Don’t allow poisoning leads with random IDs
    throw new Error('Invalid campaign');
  }
  const data = snap.data() as any;
  if (data?.tenantId !== tenantId) {
    throw new Error('Invalid campaign');
  }
  return campaignId;
}

export async function POST(req: NextRequest) {
  const logger = createApiLogger(req, { route: 'POST /api/leads' });
  try {
    const payload = payloadSchema.parse(await req.json());
    const db = getAdminDb();
    const ip = getRequestIp(req);

    // Public lead capture is allowed only for published sites; tenantId is never accepted from client input.
    let context: Awaited<ReturnType<typeof requireRole>> | null = null;
    const authHeader = req.headers.get('authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      context = await requireRole(req, ALL_ROLES);
    }

    const honeypot =
      payload.honeypot ||
      (payload.metadata?.honeypot as string | undefined) ||
      (payload.metadata?.website as string | undefined) ||
      (payload.context?.honeypot as string | undefined) ||
      (payload.context?.website as string | undefined);
    if (honeypot && String(honeypot).trim()) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }
    const elapsedMs = Number(payload.metadata?.elapsedMs || payload.metadata?.timeOnPageMs || 0);
    if (elapsedMs && elapsedMs < 800) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    if (!context) {
      if (!(await enforceRateLimit(`leads:public:${ip}`, 8, 60_000))) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
      }
    }

    let tenantId = context?.tenantId || null;
    let siteId = payload.siteId || null;
    if (!tenantId) {
      const resolved = await resolvePublicTenant(payload);
      if (!resolved) {
        return NextResponse.json({ error: 'Published site not found' }, { status: 404 });
      }
      tenantId = resolved.tenantId;
      siteId = resolved.siteId;
    }
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant resolution failed' }, { status: 400 });
    }
    const agentEmail = context?.email ?? null;

    logger.setTenant(tenantId);
    if (context?.uid) {
      logger.setActor(context.uid);
    }

    if (context && siteId) {
      const siteSnap = await db.collection('sites').doc(siteId).get();
      if (siteSnap.exists) {
        const siteData = siteSnap.data() || {};
        const siteTenant = siteData.tenantId as string | undefined;
        if (!siteTenant || siteTenant !== tenantId) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      } else {
        siteId = null;
      }
    }

    await enforceUsageLimit(db, tenantId, 'leads', 1);

    let campaignId: string | null = null;
    try {
      campaignId = await resolveCampaignId(db, tenantId, payload);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid campaign attribution' }, { status: 400 });
    }

    // Normalize attribution to always carry the campaignDocId when we resolve a valid campaign.
    const normalizedAttribution = (() => {
      if (!campaignId) return payload.attribution || null;
      const base = (payload.attribution || {}) as Record<string, any>;
      return { ...base, campaignDocId: base.campaignDocId || campaignId };
    })();

    const leadData = {
      tenantId,
      siteId,
      campaignId,
      project: payload.project || null,
      projectId: payload.projectId || null,
      pageSlug: payload.pageSlug || null,
      name: payload.name || null,
      email: payload.email || null,
      phone: payload.phone || null,
      message: payload.message || null,
      source: payload.source || payload.context?.service || 'Website',
      context: payload.context || null,
      attribution: normalizedAttribution,
      metadata: payload.metadata || null,
      status: 'New',
      priority: 'Warm',
      direction: DEFAULT_LEAD_DIRECTION,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const leadRef = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('leads')
      .add(leadData);

    // Audience Network event (no PII)
    try {
      await writeAudienceEvent({
        tenantId,
        campaignId,
        actor: context?.uid ? { type: 'user', uid: context.uid } : { type: 'lead', leadId: leadRef.id },
        type: 'landing.form_submit',
        payload: {
          siteId: siteId || undefined,
          source: (payload.source || payload.context?.service || 'Website') as string,
          hasEmail: !!payload.email,
          hasPhone: !!payload.phone,
        },
      });
    } catch {
      // never block lead capture
    }

    // V1: Auto-enqueue Smart Sender for campaign leads (no manual clicks required)
    if (campaignId) {
      try {
        const campaign = await getCampaign({ campaignId });
        const sender = (campaign.bindings?.sender || {}) as any;
        const draft = (sender.smartSequenceDraft || {}) as Record<string, any>;
        const hasAnyStep = !!(draft.emailSubject || draft.emailHtml || draft.smsText || draft.whatsappText);
        if (sender.enabled && hasAnyStep) {
          await createOrResetSenderRun({ tenantId, campaignId, leadId: leadRef.id });
        }
      } catch {
        // never block lead capture
      }
    }

    // Optional notifications + CRM webhook
    const settingsSnap = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('settings')
      .doc('leads')
      .get();
    const settings = settingsSnap.exists ? settingsSnap.data() : null;

    const notificationEmail = settings?.notificationEmail as string | undefined;
    const crmWebhookUrl = settings?.crmWebhookUrl as string | undefined;
    const crmProvider =
      (settings?.crmProvider as string | undefined) ||
      (crmWebhookUrl ? 'custom' : 'hubspot');

    const brokerEmails = parseEmailList(notificationEmail || NOTIFY_EMAIL_TO);
    const recipientSet = new Set<string>(brokerEmails);
    if (agentEmail) {
      recipientSet.add(agentEmail);
    }
    const emailRecipients = Array.from(recipientSet);

    if (emailRecipients.length && CAP.resend) {
      try {
        await sendLeadEmail(
          emailRecipients,
          `New lead${payload.project ? ` · ${payload.project}` : ''}`,
          `
            <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
              <h2 style="margin: 0 0 12px;">New Lead</h2>
              <p><strong>Name:</strong> ${payload.name || 'Not shared'}</p>
              <p><strong>Email:</strong> ${payload.email || 'Not shared'}</p>
              <p><strong>Phone:</strong> ${payload.phone || 'Not shared'}</p>
              <p><strong>Project:</strong> ${payload.project || 'General Inquiry'}</p>
              <p><strong>Source:</strong> ${payload.source || payload.context?.service || 'Website'}</p>
              ${payload.message ? `<p><strong>Message:</strong> ${payload.message}</p>` : ''}
            </div>
          `
        );
      } catch (error) {
        console.error('[leads] notification email failed', error);
      }
    }

    const notificationPhone =
      (settings?.notificationPhone as string | undefined) || NOTIFY_SMS_TO;
    if (notificationPhone && CAP.twilio) {
      try {
        const smsBody = [
          'New Entrestate lead',
          payload.name ? `Name: ${payload.name}` : null,
          payload.phone ? `Phone: ${payload.phone}` : null,
          payload.email ? `Email: ${payload.email}` : null,
          payload.project ? `Project: ${payload.project}` : null,
        ]
          .filter(Boolean)
          .join(' | ');
        await sendLeadSMS(notificationPhone, smsBody);
      } catch (error) {
        console.error('[leads] notification SMS failed', error);
      }
    }

    if (crmProvider === 'hubspot' && CAP.hubspot) {
      try {
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'entrestate.com';
        const pageUrl =
          payload.metadata?.pageUrl ||
          payload.context?.pageUrl ||
          payload.attribution?.pageUrl ||
          (payload.pageSlug ? `https://${rootDomain}/p/${payload.pageSlug}` : undefined);
        await upsertHubspotLead({
          email: payload.email || undefined,
          phone: payload.phone || undefined,
          name: payload.name || undefined,
          message: payload.message || undefined,
          pageUrl,
        });
      } catch (error) {
        console.error('[leads] hubspot sync failed', error);
      }
    }

    if (crmProvider === 'custom' && crmWebhookUrl) {
      try {
        await fetch(crmWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: leadRef.id, ...leadData }),
        });
      } catch (error) {
        console.error('[leads] webhook failed', error);
      }
    }

    logger.logSuccess(201, { leadId: leadRef.id, siteId });
    return NextResponse.json({ id: leadRef.id }, { status: 201 });
  } catch (error) {
    console.error('[leads] capture error', error);
    if (error instanceof PlanLimitError) {
      logger.logError(error, 402, { metric: error.metric, limit: error.limit });
      return NextResponse.json(planLimitErrorResponse(error), { status: 402 });
    }
    if (error instanceof z.ZodError) {
      logger.logError(error, 400, { validation_errors: error.errors });
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      logger.logError(error, 401);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      logger.logError(error, 403);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    logger.logError(error, 500);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
