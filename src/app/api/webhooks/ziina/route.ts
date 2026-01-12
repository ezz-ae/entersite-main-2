import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { getAdminDb } from '@/server/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { createApiLogger } from '@/lib/logger';
import { BILLING_SKUS, logBillingEvent, resolveBillingSku } from '@/lib/server/billing';

const ZIINA_WEBHOOK_SECRET = process.env.ZIINA_WEBHOOK_SECRET;

function verifySignature(rawBody: string, signature?: string | null) {
  if (!ZIINA_WEBHOOK_SECRET || !signature) return false;
  const digest = createHmac('sha256', ZIINA_WEBHOOK_SECRET).update(rawBody).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

function resolveTenantId(payload: any) {
  return (
    payload?.metadata?.tenantId ||
    payload?.data?.metadata?.tenantId ||
    payload?.tenantId ||
    payload?.data?.tenantId ||
    null
  );
}

function mapStatus(value?: string | null) {
  if (!value) return 'active';
  const normalized = value.toLowerCase();
  if (normalized.includes('fail') || normalized.includes('cancel')) return 'canceled';
  if (normalized.includes('pending') || normalized.includes('hold')) return 'past_due';
  return 'active';
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}

export async function POST(req: NextRequest) {
  const logger = createApiLogger(req, { route: 'POST /api/webhooks/ziina' });
  const ip = getRequestIp(req);
  if (!(await enforceRateLimit(`webhook:ziina:${ip}`, 60, 60_000))) {
    logger.logRateLimit();
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get('x-ziina-signature') || req.headers.get('ziina-signature');

  if (!verifySignature(rawBody, signature)) {
    logger.logError('Ziina signature invalid', 400);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const tenantId = resolveTenantId(event);
  if (!tenantId) {
    logger.logSuccess(200, { outcome: 'no_tenant' });
    return NextResponse.json({ received: true });
  }

  const eventId = event?.id || event?.data?.id || null;
  const status = mapStatus(event.status || event.type || event.event);
  const sku =
    resolveBillingSku(event?.metadata?.sku || event?.data?.metadata?.sku) ||
    resolveBillingSku(event?.metadata?.plan || event?.data?.metadata?.plan);
  const skuInfo = sku ? BILLING_SKUS[sku] : null;
  const db = getAdminDb();
  const subscriptionRef = db.collection('subscriptions').doc(tenantId);
  const subscriptionSnap = await subscriptionRef.get();
  const existingData = subscriptionSnap.exists ? subscriptionSnap.data() : null;

  if (eventId && existingData?.lastEventId === eventId) {
    logger.logSuccess(200, { outcome: 'duplicate', tenantId });
    return NextResponse.json({ received: true, duplicate: true });
  }

  const planFromMeta = resolveBillingSku(event?.metadata?.plan || event?.data?.metadata?.plan);
  const planFromSku = skuInfo?.type === 'plan' ? skuInfo.plan : null;
  const planFromEvent = planFromMeta ? BILLING_SKUS[planFromMeta]?.plan : null;
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
        lastEventType: event.type || event.event || null,
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
    lastEventType: event.type || event.event || null,
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
