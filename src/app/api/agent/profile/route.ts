import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES, ALL_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';
import { getAgentProfile, saveAgentProfile } from '@/server/agent/agent-profile';

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const profile = await getAgentProfile(tenantId);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('[agent/profile] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load agent profile' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const payload = await req.json();
    const profile = await saveAgentProfile(tenantId, payload?.profile || payload);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('[agent/profile] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to update agent profile' }, { status: 500 });
  }
}
