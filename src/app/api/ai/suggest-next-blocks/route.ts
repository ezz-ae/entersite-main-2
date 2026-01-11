import { suggestNextBlocksFlow } from '@/ai/flows/suggest-next-blocks';
import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ALL_ROLES);
    const body = await req.json();
    const result = await suggestNextBlocksFlow.run(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
