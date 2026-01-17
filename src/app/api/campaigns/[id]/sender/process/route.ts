import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { processDueSenderRuns } from '@/server/sender/sender-processor';
import { enforceSameOrigin } from '@/lib/server/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const schema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export async function POST(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { id } = await paramsPromise;
  try {
    enforceSameOrigin(req);
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const { searchParams } = new URL(req.url);
    const parsed = schema.parse({ limit: searchParams.get('limit') || undefined });

    const out = await processDueSenderRuns({ tenantId, campaignId: id, limit: parsed.limit });
    return NextResponse.json(out);
  } catch (error) {
    console.error('[campaigns/sender/process] error', error);
    if (error instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors }, { status: 400 });
    return NextResponse.json({ error: 'Failed to process sender queue' }, { status: 500 });
  }
}
