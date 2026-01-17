import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { getAdminDb } from '@/server/firebase-admin';
import { enforceSameOrigin } from '@/lib/server/security';

const schema = z.object({
  status: z.enum(['Active', 'Paused']),
});

export async function PATCH(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  try {
    enforceSameOrigin(req);
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const body = schema.parse(await req.json());
    const { id } = await paramsPromise;
    const db = getAdminDb();
    const ref = db
      .collection('tenants')
      .doc(tenantId)
      .collection('ads_campaigns')
      .doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    const now = new Date().toISOString();
    const updates: Record<string, any> = {
      status: body.status,
      updatedAt: now,
    };
    if (body.status === 'Paused') {
      updates.pausedAt = now;
    } else {
      updates.resumedAt = now;
    }
    await ref.set(updates, { merge: true });
    return NextResponse.json({ success: true, status: body.status });
  } catch (error) {
    console.error('[ads/google/campaigns/status] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to update campaign status' }, { status: 500 });
  }
}
