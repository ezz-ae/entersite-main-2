import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { BILLING_SKUS, resolveBillingSku } from '@/lib/server/billing';

const API_KEY = process.env.ZIINA_API_KEY;
const BASE_URL = process.env.ZIINA_BASE_URL || 'https://api.sandbox.ziina.com';

const requestSchema = z.object({
  planId: z.string().optional(),
  sku: z.string().optional(),
  currency: z.string().length(3).default('AED'),
  returnUrl: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    if (!API_KEY) {
      return NextResponse.json({ error: 'Ziina is not configured' }, { status: 500 });
    }

    const payload = requestSchema.parse(await req.json());
    const sku = resolveBillingSku(payload.sku || payload.planId);
    if (!sku || !BILLING_SKUS[sku]) {
      return NextResponse.json({ error: 'Unknown billing SKU' }, { status: 400 });
    }
    const skuInfo = BILLING_SKUS[sku];
    if (sku === 'agency_os') {
      return NextResponse.json({ error: 'Agency OS is sold manually' }, { status: 400 });
    }
    const amountAed = skuInfo.priceAed;

    const response = await fetch(`${BASE_URL}/v1/charges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        amount: Math.round(amountAed * 100),
        currency: payload.currency.toUpperCase(),
        description: skuInfo.label,
        return_url: payload.returnUrl || 'https://entrestate.com/dashboard/billing?payment=success',
        metadata: {
          tenantId,
          sku,
          plan: skuInfo.plan || null,
        },
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
