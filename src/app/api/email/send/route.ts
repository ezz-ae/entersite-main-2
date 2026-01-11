'use server';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { enforceRateLimit, getRequestIp } from '@/lib/rate-limit';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { createApiLogger } from '@/lib/logger';
import { CAP } from '@/lib/capabilities';
import { resend, fromEmail } from '@/lib/resend';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { enforceUsageLimit, PlanLimitError } from '@/lib/server/billing';
import { getAdminDb } from '@/server/firebase-admin';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

const payloadSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const logger = createApiLogger(req, { route: 'POST /api/email/send' });
  try {
    const { tenantId, uid } = await requireRole(req, ADMIN_ROLES);
    if (!CAP.resend || !resend) {
      logger.logError('Resend not configured', 500);
      return NextResponse.json({ error: 'Email provider is not configured' }, { status: 500 });
    }

    const ip = getRequestIp(req);
    if (!enforceRateLimit(`email:send:${tenantId}:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
      logger.logRateLimit();
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const payload = payloadSchema.parse(await req.json());
    await enforceUsageLimit(getAdminDb(), tenantId, 'email_sends', 1);
    logger.setTenant(tenantId);
    logger.setActor(uid);

    const { data, error } = await resend.emails.send({
      from: `Entrelead <${fromEmail()}>`,
      to: payload.to,
      subject: payload.subject,
      html: `<div style="font-family: sans-serif; line-height: 1.6; color: #333;">${payload.body}</div>`,
    });

    if (error) {
      logger.logError(new Error(error.message), 500, { provider: 'resend', details: error });
      return NextResponse.json({ error: 'Failed to send email', details: error }, { status: 500 });
    }
    
    logger.logSuccess(200, { to: payload.to, resend_id: data?.id });
    return NextResponse.json({ success: true, messageId: data?.id });

  } catch (error: any) {
    if (error instanceof PlanLimitError) {
      logger.logError(error, 402, { metric: error.metric, limit: error.limit });
      return NextResponse.json(
        { error: 'Plan limit reached', metric: error.metric, limit: error.limit },
        { status: 402 }
      );
    }
    if (error instanceof z.ZodError) {
      logger.logError(error, 400, { validation_errors: error.errors })
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
        logger.logError(error, 401)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
        logger.logError(error, 403)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    logger.logError(error, 500);
    return NextResponse.json({
      error: 'An unexpected error occurred.',
    }, { status: 500 });
  }
}
