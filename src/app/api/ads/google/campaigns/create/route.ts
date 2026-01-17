
import { NextRequest, NextResponse } from 'next/server';
import { createCampaign } from '@/server/ads/google/campaignSpine';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';

const CreateCampaignSchema = z.object({
  landingPageUrl: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const body = await req.json();
    if (body?.tenantId) {
      return NextResponse.json({ error: 'Do not send tenantId in request payload.' }, { status: 400 });
    }
    const data = CreateCampaignSchema.parse(body);
    const { tenantId } = await requireRole(req, ADMIN_ROLES);

    const { campaignId } = await createCampaign({ tenantId, landingPageUrl: data.landingPageUrl });

    return NextResponse.json({ campaignId });
  } catch (error) {
    console.error('Failed to create campaign:', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}
