import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { FieldValue } from 'firebase-admin/firestore';
import type { Firestore } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

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
  tenantId: z.string().optional(),
  siteId: z.string().optional(),
});

type LeadPayload = z.infer<typeof payloadSchema>;

const splitName = (name?: string) => {
  if (!name) {
    return {};
  }
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return {};
  }
  if (parts.length === 1) {
    return { firstname: parts[0] };
  }
  return {
    firstname: parts[0],
    lastname: parts.slice(1).join(' '),
  };
};

const buildHubspotProperties = (payload: LeadPayload) => {
  const properties: Record<string, string> = {};
  if (payload.email) {
    properties.email = payload.email;
  }
  if (payload.phone) {
    properties.phone = payload.phone;
  }
  const { firstname, lastname } = splitName(payload.name);
  if (firstname) {
    properties.firstname = firstname;
  }
  if (lastname) {
    properties.lastname = lastname;
  }
  return properties;
};

async function syncHubspotContact(token: string, payload: LeadPayload) {
  const properties = buildHubspotProperties(payload);
  if (!Object.keys(properties).length) {
    return { skipped: true };
  }

  const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ properties }),
  });

  if (res.ok) {
    return { success: true };
  }

  if (res.status === 409 && payload.email) {
    const updateRes = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(payload.email)}?idProperty=email`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      }
    );
    if (updateRes.ok) {
      return { success: true, updated: true };
    }
    const updateError = await updateRes.text();
    console.error('[leads] hubspot update failed', updateRes.status, updateError);
    return { success: false };
  }

  const errorBody = await res.text();
  console.error('[leads] hubspot create failed', res.status, errorBody);
  return { success: false };
}

async function resolveTenant(db: Firestore, payload: LeadPayload) {
  if (payload.tenantId) {
    return payload.tenantId;
  }

  if (payload.siteId) {
    const siteSnap = await db.collection('sites').doc(payload.siteId).get();
    if (siteSnap.exists) {
      const data = siteSnap.data() || {};
      return (data.tenantId as string) || (data.ownerUid as string) || 'public';
    }
  }

  return 'public';
}

export async function POST(req: NextRequest) {
  try {
    const payload = payloadSchema.parse(await req.json());
    const db = getAdminDb();
    const tenantId = await resolveTenant(db, payload);

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

    if (notificationEmail && RESEND_API_KEY && FROM_EMAIL) {
      const resend = new Resend(RESEND_API_KEY);
      await resend.emails.send({
        from: `Entrestate <${FROM_EMAIL}>`,
        to: notificationEmail,
        subject: `New lead${payload.project ? ` · ${payload.project}` : ''}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
            <h2 style="margin: 0 0 12px;">New Lead</h2>
            <p><strong>Name:</strong> ${payload.name || 'Not shared'}</p>
            <p><strong>Email:</strong> ${payload.email || 'Not shared'}</p>
            <p><strong>Phone:</strong> ${payload.phone || 'Not shared'}</p>
            <p><strong>Project:</strong> ${payload.project || 'General Inquiry'}</p>
            <p><strong>Source:</strong> ${payload.source || payload.context?.service || 'Website'}</p>
            ${payload.message ? `<p><strong>Message:</strong> ${payload.message}</p>` : ''}
          </div>
        `,
      });
    }

    if (crmProvider === 'hubspot' && HUBSPOT_ACCESS_TOKEN) {
      try {
        await syncHubspotContact(HUBSPOT_ACCESS_TOKEN, payload);
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
