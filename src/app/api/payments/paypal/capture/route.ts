import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { paypalRequest } from '@/server/paypal';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';

const requestSchema = z.object({
  orderId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ADMIN_ROLES);
    const payload = requestSchema.parse(await req.json());

    const response = await paypalRequest(`/v2/checkout/orders/${payload.orderId}/capture`, {
      method: 'POST',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'PayPal capture failed', details: data }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[paypal/capture] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to capture order' }, { status: 500 });
  }
}
