import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { getAdminDb } from '@/server/firebase-admin';

const schema = z.object({
  limit: z.coerce.number().int().min(1).max(500).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const parsed = schema.parse({ limit: req.nextUrl.searchParams.get('limit') ?? undefined });
    const limit = parsed.limit ?? 100;

    const db = getAdminDb();
    const snap = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('audience_actions')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const actions = snap.docs.map((d) => d.data());
    return NextResponse.json({ success: true, actions });
  } catch (error) {
    console.error('[audience/actions/list] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid params', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load actions' }, { status: 500 });
  }
}
