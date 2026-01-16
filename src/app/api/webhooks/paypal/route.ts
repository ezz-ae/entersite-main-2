import { NextRequest, NextResponse } from 'next/server';
import { paypalRequest } from '@/server/paypal';
import { getAdminDb } from '@/server/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { createApiLogger } from '@/lib/logger';
import {
  BILLING_SKUS,
  BillingSku,
  logBillingEvent,
  resolveBillingSku,
} from '@/lib/server/billing';

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

function mapPlanId(value?: string | null) {
  if (!value) return null;
  const normalized = value.toLowerCase();
  if (normalized.includes('agency')) return 'agency_os';
  if (normalized.includes('growth')) return 'agent_growth';
  if (normalized.includes('pro')) return 'agent_pro';
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

function resolveSku(event: any): BillingSku | null {
  const resource = event?.resource || {};
  const purchaseUnit = Array.isArray(resource.purchase_units) ? resource.purchase_units[0] : null;
  return (
    resolveBillingSku(purchaseUnit?.reference_id) ||
    resolveBillingSku(resource.plan_id) ||
    resolveBillingSku(resource.billing_plan_id) ||
    null
  );
}

function mapStatus(eventType?: string | null) {
  if (!eventType) return 'active';
  if (eventType.includes('CANCEL')) return 'canceled';
  if (eventType.includes('SUSPEND') || eventType.includes('PAST_DUE') || eventType.includes('FAIL')) {
    return 'past_due';
  }
  return 'active';
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}

export async function POST(req: NextRequest) {
  const logger = createApiLogger(req, { route: 'POST /api/webhooks/paypal' });
  const ip = getRequestIp(req);
  if (!(await enforceRateLimit(`webhook:paypal:${ip}`, 60, 60_000))) {
    logger.logRateLimit();
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
    logger.logError('PayPal webhook id not configured', 500);
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
    logger.logError('PayPal signature invalid', 400);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const tenantId = resolveTenantId(event);
  if (!tenantId) {
    logger.logSuccess(200, { outcome: 'no_tenant' });
    return NextResponse.json({ received: true });
  }

  const eventId = event?.id || null;
  const sku = resolveSku(event);
  const skuInfo = sku ? BILLING_SKUS[sku] : null;
  const status = mapStatus(event.event_type);
  const db = getAdminDb();
  const subscriptionRef = db.collection('subscriptions').doc(tenantId);
  const subscriptionSnap = await subscriptionRef.get();
  const existingData = subscriptionSnap.exists ? subscriptionSnap.data() : null;

  if (eventId && existingData?.lastEventId === eventId) {
    logger.logSuccess(200, { outcome: 'duplicate', tenantId });
    return NextResponse.json({ received: true, duplicate: true });
  }

  const planFromEvent = resolvePlanId(event);
  const planFromSku = skuInfo?.type === 'plan' ? skuInfo.plan : null;
  const hasPlanUpdate = Boolean(planFromSku || planFromEvent);

  if (skuInfo?.type === 'addon' && skuInfo.addOns) {
    const addOnUpdates: Record<string, unknown> = {};
    Object.entries(skuInfo.addOns).forEach(([key, value]) => {
      addOnUpdates[`addOns.${key}`] = FieldValue.increment(Number(value));
    });
    await subscriptionRef.set(
      {
        ...addOnUpdates,
        lastEventId: eventId,
        lastEventType: event.event_type || null,
        lastPaymentAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    await logBillingEvent(db, tenantId, {
      type: 'add_on_applied',
      sku,
      addOns: skuInfo.addOns,
    });

    logger.logSuccess(200, { outcome: 'addon_applied', tenantId, sku });
    return NextResponse.json({ received: true });
  }

  if (!hasPlanUpdate && !subscriptionSnap.exists) {
    logger.logSuccess(200, { outcome: 'ignored', tenantId });
    return NextResponse.json({ received: true, ignored: true });
  }

  const now = new Date();
  const periodStart = now.toISOString();
  const periodEnd = addMonths(now, 1).toISOString();

  const subscriptionUpdates: Record<string, unknown> = {
    status,
    cancelAtPeriodEnd: false,
    lastEventId: eventId,
    lastEventType: event.event_type || null,
    lastPaymentAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (hasPlanUpdate) {
    subscriptionUpdates.plan = planFromSku || planFromEvent;
  }

  if (status === 'active') {
    subscriptionUpdates.currentPeriodStart = periodStart;
    subscriptionUpdates.currentPeriodEnd = periodEnd;
    subscriptionUpdates['trial.endedAt'] = periodStart;
    subscriptionUpdates['trial.endedReason'] = 'subscription_started';
  }

  await subscriptionRef.set(subscriptionUpdates, { merge: true });

  await logBillingEvent(db, tenantId, {
    type: 'subscription_updated',
    plan: hasPlanUpdate ? (planFromSku || planFromEvent) : (existingData?.plan as string | undefined),
    status,
    sku,
  });

  logger.logSuccess(200, { outcome: 'subscription_updated', tenantId, sku });
  return NextResponse.json({ received: true });
}
