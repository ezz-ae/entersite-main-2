'use server';

import { NextRequest, NextResponse } from 'next/server';

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
  const activities = Array.from({ length: 5 }).map(generateActivity);
  return NextResponse.json(activities);
}
