import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { getAdminDb } from '@/server/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ADMIN_ROLES);
    const { searchParams } = new URL(req.url);
    const limitParam = Number(searchParams.get('limit') || 50);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 50;

    const snap = await getAdminDb()
      .collection('audiences_global')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const signals = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ signals });
  } catch (error) {
    console.error('[audience/global] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load global audience signals' }, { status: 500 });
  }
}
