import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { CAP } from '@/lib/capabilities';
import { resend, fromEmail } from '@/lib/resend';
import { ADMIN_ROLES } from '@/lib/server/roles';

const payloadSchema = z.object({
  email: z.string().email(),
  role: z.enum(['agent', 'team_admin', 'agency_admin']),
});

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);

    const db = getAdminDb();
    const snapshot = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('teamInvites')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const invites = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ invites });
  } catch (error) {
    console.error('[team/invites] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load invites' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = payloadSchema.parse(await req.json());
    const { tenantId, email: inviterEmail, uid } = await requireRole(req, ADMIN_ROLES);

    const db = getAdminDb();
    const inviteRef = db
      .collection('tenants')
      .doc(tenantId)
      .collection('teamInvites')
      .doc();

    const inviteData = {
      email: payload.email,
      role: payload.role,
      status: 'pending',
      invitedBy: inviterEmail || uid,
      createdAt: FieldValue.serverTimestamp(),
    };

    await inviteRef.set(inviteData);

    if (CAP.resend && resend) {
      await resend.emails.send({
        from: `Entrestate Team <${fromEmail()}>`,
        to: payload.email,
        subject: 'You are invited to Entrestate',
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
            <h2 style="margin: 0 0 12px;">You are invited</h2>
            <p>You have been invited to join an Entrestate workspace as <strong>${payload.role}</strong>.</p>
            <p>Open the link below to sign in or create your account:</p>
            <p><a href="https://entrestate.com/start">https://entrestate.com/start</a></p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, invite: { id: inviteRef.id, ...inviteData } });
  } catch (error) {
    console.error('[team/invites] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to send invite' }, { status: 500 });
  }
}
