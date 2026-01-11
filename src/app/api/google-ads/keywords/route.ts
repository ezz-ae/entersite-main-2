'use server';

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ALL_ROLES);
    // In a real app, you'd use a service like OpenAI to generate these
    const mockKeywords = [
      { keyword: 'luxury real estate', matchType: 'Broad' },
      { keyword: 'buy apartment dubai', matchType: 'Phrase' },
      { keyword: 'downtown penthouse for sale', matchType: 'Exact' },
      { keyword: 'invest in Dubai property', matchType: 'Broad' },
      { keyword: 'Emaar beachfront prices', matchType: 'Phrase' },
    ];
    return NextResponse.json(mockKeywords);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load keywords' }, { status: 500 });
  }
}
