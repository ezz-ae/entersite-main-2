import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminDb } from '@/server/firebase-admin';
import { requireTenantScope, UnauthorizedError, ForbiddenError } from '@/server/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const querySchema = z.object({
  tenantId: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = querySchema.parse({
      tenantId: searchParams.get('tenantId') || undefined,
      limit: searchParams.get('limit') || undefined,
    });

    const { tenantId } = await requireTenantScope(req, parsed.tenantId);

    const db = getAdminDb();
    const snapshot = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('leads')
      .orderBy('createdAt', 'desc')
      .limit(parsed.limit)
      .get();

    const leads = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ data: leads });
  } catch (error) {
    console.error('[leads/list] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
