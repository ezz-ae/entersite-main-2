import { NextRequest, NextResponse } from 'next/server';
import { listCampaigns } from '@/server/ads/google/googleAdsService';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get('tenantId')) {
      return NextResponse.json({ error: 'Do not send tenantId in request query.' }, { status: 400 });
    }
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const campaigns = await listCampaigns(tenantId);

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Failed to list campaigns:', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
