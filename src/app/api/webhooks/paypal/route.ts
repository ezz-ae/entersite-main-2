import { NextRequest, NextResponse } from 'next/server';
import { paypalRequest } from '@/server/paypal';
import { getAdminDb } from '@/server/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

function mapPlanId(value?: string | null) {
  if (!value) return null;
  const normalized = value.toLowerCase();
  if (normalized.includes('agency')) return 'agency';
  if (normalized.includes('pro')) return 'pro';
  if (normalized.includes('starter')) return 'starter';
  return null;
}

function resolveTenantId(event: any) {
  const resource = event?.resource || {};
  const purchaseUnit = Array.isArray(resource.purchase_units) ? resource.purchase_units[0] : null;
  return (
    purchaseUnit?.custom_id ||
    resource.custom_id ||
    resource.subscriber?.custom_id ||
    null
  );
}

function resolvePlanId(event: any) {
  const resource = event?.resource || {};
  const purchaseUnit = Array.isArray(resource.purchase_units) ? resource.purchase_units[0] : null;
  return (
    mapPlanId(purchaseUnit?.reference_id) ||
    mapPlanId(resource.plan_id) ||
    mapPlanId(resource.billing_plan_id) ||
    null
  );
}

function mapStatus(eventType?: string | null) {
  if (!eventType) return 'active';
  if (eventType.includes('CANCEL')) return 'canceled';
  if (eventType.includes('SUSPEND') || eventType.includes('PAST_DUE')) return 'past_due';
  if (eventType.includes('EXPIRE')) return 'inactive';
  return 'active';
}

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req);
  if (!enforceRateLimit(`webhook:paypal:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const rawBody = await req.text();
  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (!PAYPAL_WEBHOOK_ID) {
    return NextResponse.json({ error: 'PayPal webhook id not configured' }, { status: 500 });
  }

  const verificationPayload = {
    auth_algo: req.headers.get('paypal-auth-algo'),
    cert_url: req.headers.get('paypal-cert-url'),
    transmission_id: req.headers.get('paypal-transmission-id'),
    transmission_sig: req.headers.get('paypal-transmission-sig'),
    transmission_time: req.headers.get('paypal-transmission-time'),
    webhook_id: PAYPAL_WEBHOOK_ID,
    webhook_event: event,
  };

  const verifyResponse = await paypalRequest('/v1/notifications/verify-webhook-signature', {
    method: 'POST',
    body: JSON.stringify(verificationPayload),
  });
  const verifyData = await verifyResponse.json().catch(() => null);

  if (!verifyResponse.ok || verifyData?.verification_status !== 'SUCCESS') {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const tenantId = resolveTenantId(event);
  if (!tenantId) {
    return NextResponse.json({ received: true });
  }

  const plan = resolvePlanId(event) || 'starter';
  const status = mapStatus(event.event_type);
  const db = getAdminDb();

  await db
    .collection('subscriptions')
    .doc(tenantId)
    .set(
      {
        plan,
        status,
        lastEventId: event.id || null,
        lastEventType: event.event_type || null,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

  return NextResponse.json({ received: true });
}
