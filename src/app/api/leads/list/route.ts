import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = querySchema.parse({
      limit: searchParams.get('limit') || undefined,
    });

    const { tenantId } = await requireRole(req, ALL_ROLES);

    const db = getAdminDb();
    const snapshot = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('leads')
      .orderBy('createdAt', 'desc')
      .limit(parsed.limit)
      .get();

    const leads = snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt;
      const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt;
      return {
        id: doc.id,
        ...data,
        createdAt,
        updatedAt,
      };
    });

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
