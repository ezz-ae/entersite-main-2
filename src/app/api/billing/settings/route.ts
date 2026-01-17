import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';

type SettingsPayload = {
  vatNumber?: string | null;
  monthlySpendCap?: number | null;
  pauseWhenCapReached?: boolean;
  paymentModel?: 'prepaid' | 'postpaid';
};

export async function PATCH(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const payload = (await req.json()) as SettingsPayload;
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const db = getAdminDb();
    const updates: Record<string, any> = {};
    if (payload.vatNumber !== undefined) {
      updates.vatNumber = payload.vatNumber ? String(payload.vatNumber).trim() : null;
    }
    if (payload.monthlySpendCap !== undefined) {
      updates.monthlySpendCap =
        payload.monthlySpendCap === null ? null : Math.max(0, Number(payload.monthlySpendCap));
    }
    if (payload.pauseWhenCapReached !== undefined) {
      updates.pauseWhenCapReached = Boolean(payload.pauseWhenCapReached);
      if (updates.pauseWhenCapReached && updates.monthlySpendCap == null) {
        updates.monthlySpendCap = updates.monthlySpendCap ?? null;
      }
    }
    if (payload.paymentModel) {
      updates.paymentModel = payload.paymentModel;
    }

    if (!Object.keys(updates).length) {
      return NextResponse.json({ success: true });
    }

    updates.isPausedDueToSpendCap = false;
    await db
      .collection('subscriptions')
      .doc(tenantId)
      .set(
        {
          ...updates,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[billing/settings] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to update billing settings' }, { status: 500 });
  }
}
