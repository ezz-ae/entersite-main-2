import { NextResponse } from 'next/server';

export async function GET() {
  const sites = [
    { name: 'acme.com', status: 'live' },
    { name: 'starter-template.dev', status: 'live' },
    { name: 'shop.acme.com', status: 'pending' },
  ];

  return NextResponse.json(sites);
}
