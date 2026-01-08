'use server';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // In a real app, you'd use a service like OpenAI to generate these
  const mockKeywords = [
    { keyword: 'luxury real estate', matchType: 'Broad' },
    { keyword: 'buy apartment dubai', matchType: 'Phrase' },
    { keyword: 'downtown penthouse for sale', matchType: 'Exact' },
    { keyword: 'invest in Dubai property', matchType: 'Broad' },
    { keyword: 'Emaar beachfront prices', matchType: 'Phrase' },
  ];
  return NextResponse.json(mockKeywords);
}
