import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { patchCampaignBindings } from '@/server/campaigns/campaign-store';
import { assertCampaignOwnedByTenant } from '@/server/campaigns/campaign-guards';
import { enforceSameOrigin } from '@/lib/server/security';

const schema = z.object({
  bindings: z.record(z.any()),
});

export async function PATCH(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { id } = await paramsPromise;
  try {
    enforceSameOrigin(req);
    const { tenantId } = await requireRole(req, ALL_ROLES);
    await assertCampaignOwnedByTenant({ campaignId: id, tenantId });

    const body = schema.parse(await req.json());
    const campaign = await patchCampaignBindings({
      campaignId: id,
      bindings: body.bindings,
    });

    return NextResponse.json({ campaign });
  } catch (err: any) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (err?.name === 'ZodError') return NextResponse.json({ error: 'Invalid request', details: err.errors }, { status: 400 });
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
