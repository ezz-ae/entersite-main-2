'use server';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

const randomFrom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

const generateActivity = () => ({
  id: `evt_${Date.now()}`,
  type: randomFrom(['impression', 'click', 'conversion']),
  description: randomFrom([
    'New click from a user in London, UK',
    'Ad impression served in Dubai, UAE',
    'Successful conversion from a user in New York, USA',
    'User spent 2 minutes on the landing page',
    'Ad impression on the Search Network',
  ]),
  time: new Date().toLocaleTimeString(),
});

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ALL_ROLES);
    const activities = Array.from({ length: 5 }).map(generateActivity);
    return NextResponse.json(activities);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load activity' }, { status: 500 });
  }
}
