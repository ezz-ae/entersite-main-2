import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { paypalRequest } from '@/server/paypal';
import { requireAuth, UnauthorizedError, ForbiddenError } from '@/server/auth';

const requestSchema = z.object({
  planId: z.string().optional(),
  amount: z.string().min(1),
  currency: z.string().length(3).default('USD'),
});

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    const payload = requestSchema.parse(await req.json());

    const body = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: payload.currency.toUpperCase(),
            value: payload.amount,
          },
          reference_id: payload.planId,
        },
      ],
    };

    const response = await paypalRequest('/v2/checkout/orders', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'PayPal order creation failed', details: data }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[paypal/create] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
