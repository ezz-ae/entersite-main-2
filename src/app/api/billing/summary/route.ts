import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { getBillingSummary } from '@/lib/server/billing';

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const db = getAdminDb();
    const summary = await getBillingSummary(db, tenantId);

    const [membersSnap, invitesSnap] = await Promise.all([
      db.collection('tenants').doc(tenantId).collection('members').get(),
      db
        .collection('tenants')
        .doc(tenantId)
        .collection('teamInvites')
        .where('status', '==', 'pending')
        .get(),
    ]);

    const seatsUsed = Math.max(1, membersSnap.size + 1) + invitesSnap.size;
    const seatsLimit = summary.limits.seats ?? null;

    const providers = {
      paypal: Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
      ziina: Boolean(process.env.ZIINA_API_KEY),
    };

    return NextResponse.json({
      ...summary,
      seats: {
        used: seatsUsed,
        limit: seatsLimit,
      },
      providers,
    });
  } catch (error) {
    console.error('[billing/summary] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load billing summary' }, { status: 500 });
  }
}
