import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { createOrResetSenderRun } from '@/server/sender/sender-store';
import { processDueSenderRuns } from '@/server/sender/sender-processor';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const bodySchema = z.object({
  mode: z.enum(['new', 'all']).default('new'),
  limit: z.number().int().min(1).max(100).default(25),
});

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const json = await req.json().catch(() => ({}));
    const parsed = bodySchema.parse({
      mode: json?.mode,
      limit: json?.limit,
    });

    const db = getAdminDb();
    const campaignRef = db.collection('tenants').doc(tenantId).collection('campaigns').doc(ctx.params.id);
    const campaignSnap = await campaignRef.get();
    if (!campaignSnap.exists) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const campaign = campaignSnap.data() || {};
    const senderEnabled = !!(campaign as any)?.bindings?.sender?.enabled;
    if (!senderEnabled) {
      return NextResponse.json({ error: 'Sender is disabled for this campaign' }, { status: 400 });
    }

    // Pull campaign leads (pipe, not CRM): newest first
    const leadsSnap = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('leads')
      .where('campaignId', '==', ctx.params.id)
      .orderBy('createdAt', 'desc')
      .limit(parsed.limit)
      .get();

    const leads = leadsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    let created = 0;
    let touched = 0;

    for (const lead of leads) {
      const force = parsed.mode === 'all';
      const out = await createOrResetSenderRun({
        tenantId,
        campaignId: ctx.params.id,
        leadId: String((lead as any).id),
        force,
      });
      touched += 1;
      if (out.created) created += 1;
    }

    // Process immediately (sends first due step; subsequent steps are queued via nextAt)
    const processed = await processDueSenderRuns({ tenantId, campaignId: ctx.params.id, limit: parsed.limit });

    return NextResponse.json({
      campaignId: ctx.params.id,
      mode: parsed.mode,
      touched,
      created,
      processed: processed.processed,
      results: processed.results,
    });
  } catch (error) {
    console.error('[campaigns/sender/run] error', error);
    if (error instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors }, { status: 400 });
    return NextResponse.json({ error: 'Failed to start sender run' }, { status: 500 });
  }
}
