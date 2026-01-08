'use server';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // In a real app, you'd fetch this from the Google Ads API
  const mockStats = {
    clicks: Math.floor(Math.random() * 5000),
    impressions: Math.floor(Math.random() * 200000),
    ctr: (Math.random() * 5).toFixed(2),
    conversions: Math.floor(Math.random() * 500),
  };
  return NextResponse.json(mockStats);
}
