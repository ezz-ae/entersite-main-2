import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { logBillingEvent } from '@/lib/server/billing';

export async function POST(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const db = getAdminDb();
    const ref = db.collection('subscriptions').doc(tenantId);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    await ref.set(
      {
        cancelAtPeriodEnd: true,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    await logBillingEvent(db, tenantId, {
      type: 'subscription_cancel_requested',
    });

    return NextResponse.json({ success: true, cancelAtPeriodEnd: true });
  } catch (error) {
    console.error('[billing/cancel] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
