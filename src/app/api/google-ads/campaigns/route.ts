'use server';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';

export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ADMIN_ROLES);
    const body = await req.json();
    const newCampaign = {
      id: `cam_${Date.now()}`,
      name: body.name || 'New Campaign',
      ...body,
    };
    return NextResponse.json(newCampaign);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}
