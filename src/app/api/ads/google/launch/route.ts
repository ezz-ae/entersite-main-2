import { NextRequest, NextResponse } from 'next/server';
import { launchCampaign } from '@/server/ads/google/googleAdsService';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';

const LaunchSchema = z.object({
  campaignId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const body = await req.json();
    if (body?.tenantId) {
      return NextResponse.json({ error: 'Do not send tenantId in request payload.' }, { status: 400 });
    }
    const validation = LaunchSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request', details: validation.error }, { status: 400 });
    }

    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const { campaignId } = validation.data;
    await launchCampaign(tenantId, campaignId);

    return NextResponse.json({ status: 'success', campaignId });
  } catch (error: any) {
    console.error('Launch failed:', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
