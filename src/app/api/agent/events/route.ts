import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES, ALL_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';
import { getAdminDb } from '@/server/firebase-admin';
import type { AgentEvent } from '@/lib/agent-profile';

const eventSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['project_launch', 'open_house', 'webinar', 'limited_offer', 'viewing_day']),
  startAt: z.string().min(1),
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

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit') || '50'), 200);
    const db = getAdminDb();
    const snap = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('agent_events')
      .orderBy('startAt', 'desc')
      .limit(limit)
      .get();
    const events = snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<AgentEvent, 'id'>) }));
    return NextResponse.json({ events });
  } catch (error) {
    console.error('[agent/events] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load events' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const payload = eventSchema.parse(await req.json());
    const db = getAdminDb();
    const ref = db.collection('tenants').doc(tenantId).collection('agent_events').doc();
    const now = FieldValue.serverTimestamp();
    await ref.set({
      ...payload,
      createdAt: now,
      updatedAt: now,
    });
    return NextResponse.json({ event: { id: ref.id, ...payload } }, { status: 201 });
  } catch (error) {
    console.error('[agent/events] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
