import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { getAdminDb } from '@/server/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';

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
  if (normalized.includes('expire')) return 'inactive';
  return 'active';
}

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req);
  if (!enforceRateLimit(`webhook:ziina:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get('x-ziina-signature') || req.headers.get('ziina-signature');

  if (!verifySignature(rawBody, signature)) {
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
    return NextResponse.json({ received: true });
  }

  const status = mapStatus(event.status || event.type || event.event);
  const plan = event?.metadata?.plan || event?.data?.metadata?.plan || 'starter';

  const db = getAdminDb();
  await db
    .collection('subscriptions')
    .doc(tenantId)
    .set(
      {
        plan,
        status,
        lastEventId: event.id || null,
        lastEventType: event.type || event.event || null,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

  return NextResponse.json({ received: true });
}
