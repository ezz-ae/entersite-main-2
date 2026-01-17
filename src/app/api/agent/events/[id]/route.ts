import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';
import { getAdminDb } from '@/server/firebase-admin';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(['project_launch', 'open_house', 'webinar', 'limited_offer', 'viewing_day']).optional(),
  startAt: z.string().min(1).optional(),
  endAt: z.string().optional(),
  location: z.string().optional(),
  audience: z.enum(['buyers', 'investors', 'agents', 'all']).optional(),
  message: z.string().optional(),
  ctaUrl: z.string().url().optional(),
  attachments: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.string().url(),
      }),
    )
    .optional(),
  urgencyTone: z.enum(['soft', 'normal', 'strong']).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { id } = await paramsPromise;
  try {
    enforceSameOrigin(req);
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const payload = updateSchema.parse(await req.json());
    const db = getAdminDb();
    const ref = db.collection('tenants').doc(tenantId).collection('agent_events').doc(id);
    await ref.set({ ...payload, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[agent/events/update] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { id } = await paramsPromise;
  try {
    enforceSameOrigin(req);
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const db = getAdminDb();
    await db.collection('tenants').doc(tenantId).collection('agent_events').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[agent/events/delete] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
