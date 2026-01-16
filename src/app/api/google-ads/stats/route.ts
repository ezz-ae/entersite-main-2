'use server';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ALL_ROLES);
    // In a real app, you'd fetch this from the Google Ads API
    const mockStats = {
      clicks: Math.floor(Math.random() * 5000),
      impressions: Math.floor(Math.random() * 200000),
      ctr: (Math.random() * 5).toFixed(2),
      conversions: Math.floor(Math.random() * 500),
    };
    return NextResponse.json(mockStats);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
