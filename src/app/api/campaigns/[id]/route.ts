import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { getCampaign } from '@/server/campaigns/campaign-store';
import { assertCampaignOwnedByTenant } from '@/server/campaigns/campaign-guards';

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    await assertCampaignOwnedByTenant({ campaignId: ctx.params.id, tenantId });
    const campaign = await getCampaign({ campaignId: ctx.params.id });
    return NextResponse.json({ campaign });
  } catch (err: any) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (err?.message === 'Campaign not found') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
