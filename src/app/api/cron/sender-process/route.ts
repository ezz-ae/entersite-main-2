import { NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import type { SenderRun } from '@/server/sender/sender-types';
import { processSenderRun } from '@/server/sender/sender-processor';
import { updateSenderRun } from '@/server/sender/sender-store';
import { runAudienceActions } from '@/server/audience/action-runner';

function isVercelCron(req: Request) {
  const h = req.headers;
  return !!(h.get('x-vercel-cron') || h.get('x-vercel-cron-job'));
}

export async function GET(req: Request) {
  // This endpoint is intended for Vercel Cron.
  // We only allow calls that look like cron invocations to avoid public abuse.
  if (!isVercelCron(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const db = getAdminDb();
  const now = Date.now();
  const limit = 100;

  const snap = await db
    .collectionGroup('senderRuns')
    .where('nextAt', '<=', now)
    .orderBy('nextAt', 'asc')
    .limit(limit)
    .get();

  const runs = snap.docs
    .map((d) => d.data() as SenderRun)
    .filter((r) => r.status === 'pending' || r.status === 'running');

  const results: Array<{ runId: string; tenantId: string; ok: boolean; action?: string; error?: string }> = [];
  const touchedTenants = new Set<string>();

  for (const run of runs) {
    touchedTenants.add(run.tenantId);
    try {
      const r = await processSenderRun(run);
      results.push({ runId: run.id, tenantId: run.tenantId, ok: !!(r as any)?.ok, action: (r as any)?.action });
    } catch (err: any) {
      const message = err?.message || 'Failed';
      await updateSenderRun({
        tenantId: run.tenantId,
        runId: run.id,
        patch: {
          status: 'failed',
          lastError: message,
          history: [...(run.history || []), { at: Date.now(), channel: 'skip', ok: false, message }],
        },
      });
      results.push({ runId: run.id, tenantId: run.tenantId, ok: false, error: message });
    }
  }

  // After processing sender deliveries, run audience action hooks (best-effort)
  const audience: Array<{ tenantId: string; ok: boolean; error?: string; summary?: any }> = [];
  for (const tenantId of touchedTenants) {
    try {
      const summary = await runAudienceActions({ tenantId, withinDays: 30 });
      audience.push({ tenantId, ok: true, summary });
    } catch (err: any) {
      audience.push({ tenantId, ok: false, error: err?.message || 'Failed' });
    }
  }

  return NextResponse.json({ processed: results.length, results, audience });
}
