import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { runAudienceActions } from '@/server/audience/action-runner';
import { enforceSameOrigin } from '@/lib/server/security';

const schema = z.object({
  withinDays: z.number().int().min(1).max(180).optional(),
  campaignId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const payload = schema.parse(await req.json().catch(() => ({})));
    const { tenantId } = await requireRole(req, ADMIN_ROLES);

    const result = await runAudienceActions({
      tenantId,
      withinDays: payload.withinDays,
      campaignId: payload.campaignId,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('[audience/actions/run] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to run audience actions' }, { status: 500 });
  }
}
