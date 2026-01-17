import { getAdminDb } from '@/server/firebase-admin';
import type { Campaign, CampaignLanding, CampaignObjective } from './campaign-types';

export async function createCampaign(params: {
  tenantId: string;
  name: string;
  objective: CampaignObjective;
}) {
  const db = getAdminDb();
  const now = Date.now();
  const ref = db.collection('campaigns').doc();

  const doc: Campaign = {
    id: ref.id,
    tenantId: params.tenantId,
    name: params.name,
    objective: params.objective,
    status: 'draft',
    landing: undefined,
    bindings: {
      ads: { provider: 'google', mode: 'ours' },
      sender: { enabled: false },
      agent: { enabled: false, deployments: [] },
      audience: { enabled: false },
    },
    createdAt: now,
    updatedAt: now,
  };

  await ref.set(doc);
  return doc;
}

export async function getCampaign(params: { campaignId: string }) {
  const db = getAdminDb();
  const snap = await db.collection('campaigns').doc(params.campaignId).get();
  if (!snap.exists) throw new Error('Campaign not found');
  return snap.data() as Campaign;
}

export async function listCampaigns(params: { tenantId: string }) {
  const db = getAdminDb();
  const q: FirebaseFirestore.Query = db.collection('campaigns').where('tenantId', '==', params.tenantId);

  const snap = await q.orderBy('updatedAt', 'desc').limit(50).get();
  return snap.docs.map((d) => d.data() as Campaign);
}

export async function setCampaignLanding(params: { campaignId: string; landing: CampaignLanding }) {
  const db = getAdminDb();
  const ref = db.collection('campaigns').doc(params.campaignId);
  const now = Date.now();

  await ref.update({
    landing: params.landing,
    updatedAt: now,
    status: 'ready',
  });

  const snap = await ref.get();
  return snap.data() as Campaign;
}

export async function patchCampaignBindings(params: {
  campaignId: string;
  bindings: Record<string, any>;
}) {
  const db = getAdminDb();
  const ref = db.collection('campaigns').doc(params.campaignId);
  const now = Date.now();

  const update: Record<string, any> = { updatedAt: now };
  Object.entries(params.bindings).forEach(([k, v]) => {
    update[`bindings.${k}`] = v;
  });

  await ref.update(update);
  const snap = await ref.get();
  return snap.data() as Campaign;
}
