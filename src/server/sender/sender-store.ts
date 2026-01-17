import { getAdminDb } from '@/server/firebase-admin';
import type { SenderRun } from './sender-types';

export function senderRunId(campaignId: string, leadId: string) {
  return `${campaignId}__${leadId}`;
}

export async function getSenderRun(params: {
  tenantId: string;
  campaignId: string;
  leadId: string;
}) {
  const db = getAdminDb();
  const id = senderRunId(params.campaignId, params.leadId);
  const ref = db.collection('tenants').doc(params.tenantId).collection('senderRuns').doc(id);
  const snap = await ref.get();
  return snap.exists ? (snap.data() as SenderRun) : null;
}

export async function createOrResetSenderRun(params: {
  tenantId: string;
  campaignId: string;
  leadId: string;
  force?: boolean;
}) {
  const db = getAdminDb();
  const now = Date.now();
  const id = senderRunId(params.campaignId, params.leadId);
  const ref = db.collection('tenants').doc(params.tenantId).collection('senderRuns').doc(id);
  const snap = await ref.get();

  if (snap.exists && !params.force) {
    return { created: false, run: snap.data() as SenderRun };
  }

  const run: SenderRun = {
    id,
    tenantId: params.tenantId,
    campaignId: params.campaignId,
    leadId: params.leadId,
    status: 'pending',
    stepIndex: 0,
    nextAt: now,
    createdAt: snap.exists ? (snap.data() as any)?.createdAt ?? now : now,
    updatedAt: now,
    history: [],
  };

  await ref.set(run, { merge: true });
  return { created: true, run };
}

export async function listDueSenderRuns(params: {
  tenantId: string;
  campaignId: string;
  limit: number;
}) {
  const db = getAdminDb();
  const now = Date.now();
  const snap = await db
    .collection('tenants')
    .doc(params.tenantId)
    .collection('senderRuns')
    .where('campaignId', '==', params.campaignId)
    .where('nextAt', '<=', now)
    .orderBy('nextAt', 'asc')
    .limit(params.limit)
    .get();

  return snap.docs
    .map((d) => d.data() as SenderRun)
    .filter((r) => r.status === 'pending' || r.status === 'running');
}

export async function listDueSenderRunsForTenant(params: {
  tenantId: string;
  limit: number;
}) {
  const db = getAdminDb();
  const now = Date.now();
  const snap = await db
    .collection('tenants')
    .doc(params.tenantId)
    .collection('senderRuns')
    .where('nextAt', '<=', now)
    .orderBy('nextAt', 'asc')
    .limit(params.limit)
    .get();

  return snap.docs
    .map((d) => d.data() as SenderRun)
    .filter((r) => r.status === 'pending' || r.status === 'running');
}

export async function listSenderRuns(params: {
  tenantId: string;
  status?: SenderRun['status'];
  limit: number;
}) {
  const db = getAdminDb();
  let q = db
    .collection('tenants')
    .doc(params.tenantId)
    .collection('senderRuns')
    .orderBy('updatedAt', 'desc')
    .limit(params.limit);

  const snap = await q.get();
  const runs = snap.docs.map((d) => d.data() as SenderRun);
  return params.status ? runs.filter((r) => r.status === params.status) : runs;
}

export async function retrySenderRun(params: {
  tenantId: string;
  runId: string;
}) {
  const db = getAdminDb();
  const ref = db.collection('tenants').doc(params.tenantId).collection('senderRuns').doc(params.runId);
  await ref.set({ status: 'pending', nextAt: Date.now(), lastError: null, updatedAt: Date.now() }, { merge: true });
}

export async function updateSenderRun(params: {
  tenantId: string;
  runId: string;
  patch: Partial<SenderRun>;
}) {
  const db = getAdminDb();
  const ref = db.collection('tenants').doc(params.tenantId).collection('senderRuns').doc(params.runId);
  await ref.set({ ...params.patch, updatedAt: Date.now() }, { merge: true });
}
