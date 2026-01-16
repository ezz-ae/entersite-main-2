import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { SUPER_ADMIN_ROLES } from '@/lib/server/roles';

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, SUPER_ADMIN_ROLES);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const status = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    providers: {
      paypal: Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
      ziina: Boolean(process.env.ZIINA_API_KEY),
    },
    webhooks: {
      paypal: Boolean(process.env.PAYPAL_WEBHOOK_ID),
      ziina: Boolean(process.env.ZIINA_WEBHOOK_SECRET),
    },
    firestore: 'disconnected',
  };

  try {
    const db = getAdminDb();
    await db.collection('subscriptions').limit(1).get();
    status.firestore = 'connected';
  } catch (error) {
    status.firestore = 'error';
    console.error('[health/monetization] firestore error', error);
  }

  return NextResponse.json(status);
}
