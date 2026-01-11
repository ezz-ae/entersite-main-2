import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

const payloadSchema = z.object({
  leadId: z.string().min(1),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
  priority: z.enum(['Hot', 'Warm', 'Cold']).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const payload = payloadSchema.parse(await req.json());
    const { tenantId } = await requireRole(req, ALL_ROLES);

    const updates: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (payload.status) updates.status = payload.status;
    if (payload.priority) updates.priority = payload.priority;

    const db = getAdminDb();
    const leadRef = db.collection('tenants').doc(tenantId).collection('leads').doc(payload.leadId);
    const leadSnap = await leadRef.get();
    if (!leadSnap.exists) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    await leadRef.update(updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[leads/update] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
