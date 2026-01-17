import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES, ALL_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';
import { getAdminDb } from '@/server/firebase-admin';

const PatchSchema = z.object({
  creditBalance: z.number().min(0).optional(),
  monthlySpendCap: z.number().min(0).optional(),
  paymentModel: z.enum(['prepaid', 'postpaid']).optional(),
  currency: z.string().min(1).max(8).optional(),
});

const DEFAULT_WALLET = {
  creditBalance: 0,
  monthlySpendCap: null,
  paymentModel: 'prepaid',
  currency: 'AED',
};

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const db = getAdminDb();
    const ref = db.collection('tenants').doc(tenantId).collection('wallets').doc('default');
    const snap = await ref.get();
    const data = snap.exists ? snap.data() : DEFAULT_WALLET;
    return NextResponse.json({ wallet: data });
  } catch (error) {
    console.error('[billing/wallet] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load wallet' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const body = PatchSchema.parse(await req.json());
    const db = getAdminDb();
    const ref = db.collection('tenants').doc(tenantId).collection('wallets').doc('default');
    const now = FieldValue.serverTimestamp();
    const payload: Record<string, unknown> = {
      ...body,
      updatedAt: now,
    };
    const snap = await ref.get();
    if (!snap.exists) {
      payload.createdAt = now;
    }
    await ref.set(payload, { merge: true });
    const updated = await ref.get();
    return NextResponse.json({ wallet: updated.data() });
  } catch (error) {
    console.error('[billing/wallet] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update wallet' }, { status: 500 });
  }
}
