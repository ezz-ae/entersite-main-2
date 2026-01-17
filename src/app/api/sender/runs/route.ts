import { NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { listSenderRuns } from '@/server/sender/sender-store';

export async function GET(req: Request) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as any;
    const limit = Math.min(Math.max(Number(searchParams.get('limit') || '50'), 1), 200);

    const runs = await listSenderRuns({ tenantId, status: status || undefined, limit });
    return NextResponse.json({ runs });
  } catch (error: any) {
    if (error instanceof UnauthorizedError) return NextResponse.json({ error: error.message }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: error.message }, { status: 403 });
    console.error('[sender/runs] error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
