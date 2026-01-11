import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

const payloadSchema = z.object({
  leadId: z.string().min(1),
  note: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const payload = payloadSchema.parse(await req.json());
    const { tenantId, uid } = await requireRole(req, ALL_ROLES);

    const firestore = getAdminDb();
    const leadRef = firestore.collection('tenants').doc(tenantId).collection('leads').doc(payload.leadId);
    const leadSnap = await leadRef.get();
    if (!leadSnap.exists) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const noteRef = await leadRef.collection('notes').add({
      content: payload.note,
      authorId: uid,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: noteRef.id }, { status: 201 });
  } catch (error) {
    console.error('[leads/notes] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
  }
}
