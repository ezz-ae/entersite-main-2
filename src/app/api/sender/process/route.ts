import { NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/server/roles';
import { processDueSenderRunsForTenant } from '@/server/sender/sender-processor';

export async function POST(req: Request) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get('limit') || '50');

    const result = await processDueSenderRunsForTenant({ tenantId, limit });
    return NextResponse.json(result);
  } catch (error: any) {
    if (error instanceof UnauthorizedError) return NextResponse.json({ error: error.message }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: error.message }, { status: 403 });
    console.error('[sender/process] error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
