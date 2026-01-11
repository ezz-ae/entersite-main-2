import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import type { Firestore } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import { CAP } from '@/lib/capabilities';
import { sendLeadEmail } from '@/lib/notifications/email';
import { sendLeadSMS } from '@/lib/notifications/sms';
import { upsertHubspotLead } from '@/lib/integrations/hubspot-leads';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

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
  context: z.record(z.any()).optional(),
  attribution: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  siteId: z.string().optional(),
});

type LeadPayload = z.infer<typeof payloadSchema>;

const parseEmailList = (value?: string | null) => {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

async function resolveTenant(db: Firestore, payload: LeadPayload, fallbackTenantId: string) {
  if (payload.siteId) {
    const siteSnap = await db.collection('sites').doc(payload.siteId).get();
    if (siteSnap.exists) {
      const data = siteSnap.data() || {};
      return (data.tenantId as string) || (data.ownerUid as string) || 'public';
    }
  }

  return fallbackTenantId;
}

export async function POST(req: NextRequest) {
  try {
    const payload = payloadSchema.parse(await req.json());
    const db = getAdminDb();
    const context = await requireRole(req, ALL_ROLES);
    const tenantId = await resolveTenant(db, payload, context.tenantId);
    const agentEmail = context.email;

    const leadData = {
      tenantId,
      siteId: payload.siteId || null,
      project: payload.project || null,
      projectId: payload.projectId || null,
      pageSlug: payload.pageSlug || null,
      name: payload.name || null,
      email: payload.email || null,
      phone: payload.phone || null,
      message: payload.message || null,
      source: payload.source || payload.context?.service || 'Website',
      context: payload.context || null,
      attribution: payload.attribution || null,
      metadata: payload.metadata || null,
      status: 'New',
      priority: 'Warm',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const leadRef = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('leads')
      .add(leadData);

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

    return NextResponse.json({ id: leadRef.id, tenantId });
  } catch (error) {
    console.error('[leads] capture error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
