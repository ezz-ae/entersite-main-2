
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminDb } from '@/server/firebase-admin';
import { requireTenantScope, UnauthorizedError, ForbiddenError } from '@/server/auth';

const querySchema = z.object({
  leadId: z.string().min(1),
  tenantId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = querySchema.parse({
      leadId: searchParams.get('leadId') || undefined,
      tenantId: searchParams.get('tenantId') || undefined,
    });

    const { tenantId } = await requireTenantScope(req, parsed.tenantId);
    const firestore = getAdminDb();
    const notesSnapshot = await firestore
      .collection('tenants')
      .doc(tenantId)
      .collection('leads')
      .doc(parsed.leadId)
      .collection('notes')
      .orderBy('createdAt', 'desc')
      .get();

    const notes = notesSnapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt;
      return { id: doc.id, ...data, createdAt };
    });

    return NextResponse.json({ notes }, { status: 200 });
  } catch (error) {
    console.error('[leads/notes/list] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}
