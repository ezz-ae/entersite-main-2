import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { CAP } from '@/lib/capabilities';
import { resend, fromEmail } from '@/lib/resend';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { enforceUsageLimit, PlanLimitError } from '@/lib/server/billing';

const MAX_RECIPIENTS = 50;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

const payloadSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
  list: z.enum(['imported', 'pilot', 'manual']),
  recipients: z.array(z.string().email()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const payload = payloadSchema.parse(await req.json());
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const ip = getRequestIp(req);
    if (!enforceRateLimit(`email:campaign:${tenantId}:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    if (!CAP.resend || !resend) {
      return NextResponse.json({ error: 'Email provider is not configured' }, { status: 500 });
    }

    const db = getAdminDb();
    let recipients: string[] = [];

    if (payload.list === 'manual') {
      recipients = payload.recipients || [];
    } else {
      const listTenant = payload.list === 'pilot' ? 'pilot' : tenantId;
      const snapshot = await db
        .collection('contacts')
        .where('tenantId', '==', listTenant)
        .where('channel', '==', 'email')
        .limit(MAX_RECIPIENTS)
        .get();

      recipients = snapshot.docs
        .map((doc) => String(doc.data().email || '').trim())
        .filter(Boolean);
    }

    if (!recipients.length) {
      return NextResponse.json({ error: 'No recipients found for this list.' }, { status: 400 });
    }

    await enforceUsageLimit(db, tenantId, 'email_sends', recipients.length);

    const formattedBody = payload.body.replace(/\n/g, '<br/>');
    let sentCount = 0;
    const failures: string[] = [];

    for (const email of recipients) {
      const { error } = await resend.emails.send({
        from: `Entrestate <${fromEmail()}>`,
        to: email,
        subject: payload.subject,
        html: `<div style="font-family: sans-serif; line-height: 1.6; color: #333;">${formattedBody}</div>`,
      });

      if (error) {
        failures.push(email);
      } else {
        sentCount += 1;
      }
    }

    return NextResponse.json({
      success: true,
      list: payload.list,
      sentCount,
      requestedCount: recipients.length,
      failedCount: failures.length,
      limited: recipients.length >= MAX_RECIPIENTS,
    });
  } catch (error) {
    if (error instanceof PlanLimitError) {
      return NextResponse.json(
        { error: 'Plan limit reached', metric: error.metric, limit: error.limit },
        { status: 402 }
      );
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('[email/campaign] error', error);
    return NextResponse.json({ error: 'Failed to send campaign.' }, { status: 500 });
  }
}
