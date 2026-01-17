import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { createCampaign, listCampaigns } from '@/server/campaigns/campaign-store';
import { enforceSameOrigin } from '@/lib/server/security';

const createSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  objective: z.enum(['leads', 'calls', 'whatsapp', 'traffic']).optional(),
});

export async function POST(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const body = createSchema.parse(await req.json());

    const campaign = await createCampaign({
      tenantId,
      name: body.name?.trim() || 'New Campaign',
      objective: body.objective || 'leads',
    });

    return NextResponse.json({ campaign });
  } catch (err: any) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (err?.name === 'ZodError') return NextResponse.json({ error: 'Invalid request', details: err.errors }, { status: 400 });
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const campaigns = await listCampaigns({ tenantId });
    return NextResponse.json({ campaigns });
  } catch (err: any) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
