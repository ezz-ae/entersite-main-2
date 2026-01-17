import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { listAudienceSegments } from '@/server/audience/segment-builder';

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaignId') || undefined;

    const segments = await listAudienceSegments({ tenantId, campaignId });
    return NextResponse.json({ success: true, segments });
  } catch (error) {
    console.error('[audience/segments/list] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to list segments' }, { status: 500 });
  }
}
