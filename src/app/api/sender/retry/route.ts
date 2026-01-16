import { NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/server/roles';
import { retrySenderRun } from '@/server/sender/sender-store';

export async function POST(req: Request) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const body = await req.json().catch(() => ({}));
    const runId = String(body?.runId || '').trim();
    if (!runId) return NextResponse.json({ error: 'runId required' }, { status: 400 });

    await retrySenderRun({ tenantId, runId });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error instanceof UnauthorizedError) return NextResponse.json({ error: error.message }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: error.message }, { status: 403 });
    console.error('[sender/retry] error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
