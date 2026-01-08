import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, UnauthorizedError, ForbiddenError } from '@/server/auth';

const API_KEY = process.env.ZIINA_API_KEY;
const BASE_URL = process.env.ZIINA_BASE_URL || 'https://api.sandbox.ziina.com';

const requestSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3).default('AED'),
  description: z.string().default('Charge'),
  returnUrl: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    if (!API_KEY) {
      return NextResponse.json({ error: 'Ziina is not configured' }, { status: 500 });
    }

    const payload = requestSchema.parse(await req.json());

    const response = await fetch(`${BASE_URL}/v1/charges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        amount: Math.round(payload.amount * 100),
        currency: payload.currency.toUpperCase(),
        description: payload.description,
        return_url: payload.returnUrl || 'https://entrestate.com/payment-complete',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'Ziina charge failed', details: data }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[ziina/create] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to create Ziina charge' }, { status: 500 });
  }
}
