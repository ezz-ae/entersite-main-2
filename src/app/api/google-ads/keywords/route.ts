import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.json(
    { error: 'Deprecated endpoint', replacement: '/api/ads/google/*' },
    { status: 410 }
  );
  res.headers.set('X-Deprecated', 'Use /api/ads/google/*');
  return res;
}
