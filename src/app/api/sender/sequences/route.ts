import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';
import { getAdminDb } from '@/server/firebase-admin';

const CreateSequenceSchema = z.object({
  name: z.string().min(1).max(120),
  campaignId: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
  steps: z.array(z.any()).optional(),
  sequenceId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaignId');
    const status = searchParams.get('status');

    let query = getAdminDb()
      .collection('tenants')
      .doc(tenantId)
      .collection('senderSequences')
      .orderBy('updatedAt', 'desc')
      .limit(50);

    if (campaignId) {
      query = query.where('campaignId', '==', campaignId);
    }
    if (status) {
      query = query.where('status', '==', status);
    }

    const snap = await query.get();
    const sequences = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ sequences });
  } catch (error) {
    console.error('[sender/sequences] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load sequences' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const body = CreateSequenceSchema.parse(await req.json());

    const now = FieldValue.serverTimestamp();
    const payload = {
      tenantId,
      name: body.name.trim(),
      campaignId: body.campaignId || null,
      status: body.status || 'draft',
      steps: body.steps || [],
      createdAt: now,
      updatedAt: now,
    };

    const db = getAdminDb();
    const sequenceId =
      body.sequenceId ||
      (body.campaignId ? `${body.campaignId}__default` : undefined);
    const ref = sequenceId
      ? db.collection('tenants').doc(tenantId).collection('senderSequences').doc(sequenceId)
      : db.collection('tenants').doc(tenantId).collection('senderSequences').doc();

    await ref.set(payload, { merge: true });

    return NextResponse.json({ sequenceId: ref.id });
  } catch (error) {
    console.error('[sender/sequences] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create sequence' }, { status: 500 });
  }
}
