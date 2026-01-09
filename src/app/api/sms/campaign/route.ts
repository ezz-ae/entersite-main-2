import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminDb } from '@/server/firebase-admin';
import { requireTenantScope, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { CAP } from '@/lib/capabilities';

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;
const MAX_RECIPIENTS = 50;

const payloadSchema = z.object({
  message: z.string().min(1).max(800),
  list: z.enum(['imported', 'pilot', 'manual']),
  recipients: z.array(z.string().min(5)).optional(),
  tenantId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const payload = payloadSchema.parse(await req.json());
    const { tenantId } = await requireTenantScope(req, payload.tenantId);

    if (!CAP.twilio || !ACCOUNT_SID || !AUTH_TOKEN || !FROM_NUMBER) {
      return NextResponse.json({ error: 'SMS provider is not configured' }, { status: 500 });
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
        .where('channel', '==', 'sms')
        .limit(MAX_RECIPIENTS)
        .get();

      recipients = snapshot.docs
        .map((doc) => String(doc.data().phone || '').trim())
        .filter(Boolean);
    }

    if (!recipients.length) {
      return NextResponse.json({ error: 'No recipients found for this list.' }, { status: 400 });
    }

    let sentCount = 0;
    const failures: string[] = [];

    for (const phone of recipients) {
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phone,
          From: FROM_NUMBER,
          Body: payload.message,
        }),
      });

      if (!response.ok) {
        failures.push(phone);
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
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('[sms/campaign] error', error);
    return NextResponse.json({ error: 'Failed to send campaign.' }, { status: 500 });
  }
}
