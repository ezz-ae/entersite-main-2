'use server';

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { enforceRateLimit, getRequestIp } from '@/lib/rate-limit';
import { requireAuth, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { createApiLogger } from '@/lib/logger';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const payloadSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
  tenantId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const logger = createApiLogger(req, { route: 'POST /api/email/send' });
  try {
    await requireAuth(req);
    if (!resend || !FROM_EMAIL) {
      logger.logError('Resend not configured', 500);
      return NextResponse.json({ error: 'Email provider is not configured' }, { status: 500 });
    }

    const ip = getRequestIp(req);
    if (!enforceRateLimit(`email:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
      logger.logRateLimit();
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const payload = payloadSchema.parse(await req.json());
    logger.setTenant(payload.tenantId);

    const { data, error } = await resend.emails.send({
      from: `Entrelead <${FROM_EMAIL}>`,
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
