'use server';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newCampaign = {
    id: `cam_${Date.now()}`,
    name: body.name || 'New Campaign',
    ...body,
  };
  return NextResponse.json(newCampaign);
}
