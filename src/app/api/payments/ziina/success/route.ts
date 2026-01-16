import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';

const API_KEY = process.env.ZIINA_API_KEY;
const BASE_URL = process.env.ZIINA_BASE_URL || 'https://api.sandbox.ziina.com';

const requestSchema = z.object({
  chargeId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    await requireRole(req, ADMIN_ROLES);
    if (!API_KEY) {
      return NextResponse.json({ error: 'Ziina is not configured' }, { status: 500 });
    }

    const { chargeId } = requestSchema.parse(await req.json());

    const response = await fetch(`${BASE_URL}/v1/charges/${chargeId}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'Ziina charge lookup failed', details: data }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[ziina/success] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch Ziina charge' }, { status: 500 });
  }
}
