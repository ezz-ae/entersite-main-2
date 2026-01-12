import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { paypalRequest } from '@/server/paypal';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { BILLING_SKUS, resolveBillingSku } from '@/lib/server/billing';

const requestSchema = z.object({
  planId: z.string().optional(),
  sku: z.string().optional(),
  currency: z.string().length(3).default('USD'),
});

const AED_TO_USD = 1 / 3.67;

function getCheckoutUrl() {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'entrestate.com';
  const base =
    rootDomain.startsWith('http://') || rootDomain.startsWith('https://')
      ? rootDomain
      : `https://${rootDomain}`;
  return base.replace(/\/+$/, '');
}

export async function POST(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const payload = requestSchema.parse(await req.json());
    const sku = resolveBillingSku(payload.sku || payload.planId);
    if (!sku || !BILLING_SKUS[sku]) {
      return NextResponse.json({ error: 'Unknown billing SKU' }, { status: 400 });
    }
    const skuInfo = BILLING_SKUS[sku];
    if (sku === 'agency_os') {
      return NextResponse.json({ error: 'Agency OS is sold manually' }, { status: 400 });
    }
    const currency = payload.currency.toUpperCase();
    const amountAed = skuInfo.priceAed;
    const amount =
      currency === 'AED'
        ? amountAed.toFixed(2)
        : (amountAed * AED_TO_USD).toFixed(2);
    const appUrl = getCheckoutUrl();

    const body = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
          reference_id: sku,
          custom_id: tenantId,
          invoice_id: `${tenantId}:${Date.now()}`,
        },
      ],
      application_context: {
        brand_name: 'Entrestate',
        landing_page: 'LOGIN',
        return_url: `${appUrl}/dashboard/billing?payment=success`,
        cancel_url: `${appUrl}/dashboard/billing?payment=cancelled`,
      },
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
