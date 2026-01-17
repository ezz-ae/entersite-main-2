import { NextRequest, NextResponse } from 'next/server';
import { rollupAudienceGlobal } from '@/server/audience/global-rollup';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';

function isVercelCron(req: NextRequest) {
  const h = req.headers;
  return !!(h.get('x-vercel-cron') || h.get('x-vercel-cron-job'));
}

export async function GET(req: NextRequest) {
  try {
    if (!isVercelCron(req)) {
      await requireRole(req, ADMIN_ROLES);
    }

    const { searchParams } = new URL(req.url);
    const withinDaysParam = Number(searchParams.get('withinDays') || 30);
    const limitParam = Number(searchParams.get('limit') || 2000);

    const withinDays = Number.isFinite(withinDaysParam) ? withinDaysParam : 30;
    const limit = Number.isFinite(limitParam) ? limitParam : 2000;

    const result = await rollupAudienceGlobal({ withinDays, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[cron/audience-global] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to roll up global audience signals' }, { status: 500 });
  }
}
