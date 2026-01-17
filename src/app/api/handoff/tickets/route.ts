import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';
import { getAdminDb } from '@/server/firebase-admin';
import { senderRunId, updateSenderRun } from '@/server/sender/sender-store';
import { writeSenderEvent } from '@/server/sender/sender-events';

const CreateTicketSchema = z.object({
  leadId: z.string().min(1),
  campaignId: z.string().min(1),
  reason: z.string().optional(),
  channel: z.enum(['call', 'whatsapp', 'email', 'other']).optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const snap = await getAdminDb()
      .collection('tenants')
      .doc(tenantId)
      .collection('handoffTickets')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
    const tickets = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('[handoff/tickets] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load handoff tickets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const body = CreateTicketSchema.parse(await req.json());

    const now = FieldValue.serverTimestamp();
    const payload = {
      tenantId,
      leadId: body.leadId,
      campaignId: body.campaignId,
      status: 'open',
      reason: body.reason || null,
      channel: body.channel || 'other',
      notes: body.notes || null,
      createdAt: now,
      updatedAt: now,
    };

    const db = getAdminDb();
    const ref = db.collection('tenants').doc(tenantId).collection('handoffTickets').doc();
    await ref.set(payload, { merge: true });

    const runId = senderRunId(body.campaignId, body.leadId);
    await updateSenderRun({
      tenantId,
      runId,
      patch: { status: 'suppressed', nextAt: Date.now(), suppressedReason: 'handoff_ticket' },
    });
    await writeSenderEvent({
      tenantId,
      campaignId: body.campaignId,
      leadId: body.leadId,
      runId,
      type: 'sender.override',
      channel: 'none',
      reason: 'handoff_ticket',
    });

    return NextResponse.json({ ticketId: ref.id });
  } catch (error) {
    console.error('[handoff/tickets] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create handoff ticket' }, { status: 500 });
  }
}
