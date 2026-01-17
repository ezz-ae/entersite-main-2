import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { enforceRateLimit, getRequestIp } from '@/lib/rate-limit';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { createApiLogger } from '@/lib/logger';
import { CAP } from '@/lib/capabilities';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';
import {
  checkUsageLimit,
  enforceUsageLimit,
  PlanLimitError,
  planLimitErrorResponse,
} from '@/lib/server/billing';
import { getAdminDb } from '@/server/firebase-admin';

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const payloadSchema = z.object({
  to: z.string().min(5),
  message: z.string().min(1).max(800),
  siteId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const logger = createApiLogger(req, { route: 'POST /api/sms/send' });
  try {
    enforceSameOrigin(req);
    const { tenantId, uid } = await requireRole(req, ADMIN_ROLES);
    if (!CAP.twilio || !ACCOUNT_SID || !AUTH_TOKEN || !FROM_NUMBER) {
      logger.logError('Twilio not configured', 500);
      return NextResponse.json({ error: 'Twilio is not configured' }, { status: 500 });
    }

    const ip = getRequestIp(req);
    if (!(await enforceRateLimit(`sms:send:${tenantId}:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS))) {
      logger.logRateLimit();
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const payload = payloadSchema.parse(await req.json());
    const db = getAdminDb();
    await checkUsageLimit(db, tenantId, 'sms_sends');
    logger.setTenant(tenantId);
    logger.setActor(uid);

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: payload.to,
        From: FROM_NUMBER,
        Body: payload.message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      logger.logError('Twilio send failed', 500, { twilioStatus: data?.status });
      return NextResponse.json({ error: 'Twilio send failed', details: data }, { status: 500 });
    }

    try {
      await enforceUsageLimit(db, tenantId, 'sms_sends', 1);
    } catch (usageError) {
      // SMS already sent; log and continue without failing the request.
      logger.logError(usageError, 200, { metric: 'sms_sends' });
    }

    logger.logSuccess(200, { to: payload.to });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('SMS Engine Error:', error);
    logger.logError(error);
    if (error instanceof PlanLimitError) {
      return NextResponse.json(planLimitErrorResponse(error), { status: 402 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
