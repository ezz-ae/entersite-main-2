import { getAdminDb } from '@/server/firebase-admin';
import type { AudienceAction } from './action-types';
import type { AudienceProfile, AudienceTier } from './profile-types';

type EntityKey = { kind: 'lead'; id: string } | { kind: 'anon'; id: string };

function entityKeyFromEvent(ev: any): EntityKey | null {
  const actor = ev?.actor;
  if (!actor) return null;
  if (actor.leadId) return { kind: 'lead', id: String(actor.leadId) };
  if (actor.fingerprint) return { kind: 'anon', id: String(actor.fingerprint) };
  return null;
}

function tierFromWeight(total: number): AudienceTier {
  if (total >= 21) return 'hot';
  if (total >= 13) return 'warm';
  if (total >= 3) return 'cold';
  return 'none';
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function runAudienceActions(params: {
  tenantId: string;
  withinDays?: number;
  campaignId?: string;
}) {
  const db = getAdminDb();
  const withinDays = params.withinDays ?? 30;
  const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000;

  let q: FirebaseFirestore.Query = db
    .collection('events')
    .where('tenantId', '==', params.tenantId)
    .where('ts', '>=', cutoff);
  if (params.campaignId) q = q.where('campaignId', '==', params.campaignId);

  const snap = await q.limit(5000).get();
  const events = snap.docs.map((d) => d.data());

  const map = new Map<string, {
    entity: EntityKey;
    total: number;
    lastEventAt: number;
    lastCampaignId?: string;
  }>();

  for (const ev of events) {
    const ek = entityKeyFromEvent(ev);
    if (!ek) continue;
    const id = `${ek.kind}:${ek.id}`;
    const w = Number(ev?.weight ?? 0) || 0;
    const ts = Number(ev?.ts ?? 0) || 0;
    const campaignId = ev?.campaignId ? String(ev.campaignId) : undefined;

    const prev = map.get(id);
    if (prev) {
      prev.total += w;
      if (ts > prev.lastEventAt) {
        prev.lastEventAt = ts;
        prev.lastCampaignId = campaignId || prev.lastCampaignId;
      }
    } else {
      map.set(id, { entity: ek, total: w, lastEventAt: ts, lastCampaignId: campaignId });
    }
  }

  const ids = Array.from(map.keys());
  const existing = new Map<string, AudienceProfile>();

  for (const group of chunk(ids, 300)) {
    const refs = group.map((id) =>
      db.collection('tenants').doc(params.tenantId).collection('audience_profiles').doc(id)
    );
    const snaps = await db.getAll(...refs);
    for (const s of snaps) {
      if (s.exists) existing.set(s.id, s.data() as AudienceProfile);
    }
  }

  const now = Date.now();
  const profiles: AudienceProfile[] = [];
  const actions: AudienceAction[] = [];

  for (const [id, v] of map.entries()) {
    const newTier = tierFromWeight(v.total);
    const prev = existing.get(id);
    const prevTier = (prev?.tier ?? 'none') as AudienceTier;

    const profile: AudienceProfile = {
      id,
      tenantId: params.tenantId,
      entity: v.entity,
      campaignId: v.lastCampaignId,
      withinDays,
      totalWeight: v.total,
      tier: newTier,
      lastEventAt: v.lastEventAt,
      updatedAt: now,
    };
    profiles.push(profile);

    // Transition hooks
    if (prevTier !== newTier && newTier === 'hot') {
      const actionId = `a_${now}_${id.replace(/[^a-zA-Z0-9:_-]/g, '_')}`;
      actions.push({
        id: actionId,
        tenantId: params.tenantId,
        campaignId: profile.campaignId,
        entityId: id,
        type: 'lead.became_hot',
        fromTier: prevTier,
        toTier: newTier,
        payload: { withinDays, totalWeight: v.total },
        createdAt: now,
      });
      actions.push({
        id: `${actionId}_notify`,
        tenantId: params.tenantId,
        campaignId: profile.campaignId,
        entityId: id,
        type: 'notify.sales',
        fromTier: prevTier,
        toTier: newTier,
        payload: { reason: 'became_hot' },
        createdAt: now,
      });
    }
  }

  const batch = db.batch();

  for (const p of profiles) {
    const ref = db.collection('tenants').doc(params.tenantId).collection('audience_profiles').doc(p.id);
    batch.set(ref, p, { merge: true });
  }

  for (const a of actions) {
    const ref = db.collection('tenants').doc(params.tenantId).collection('audience_actions').doc(a.id);
    batch.set(ref, a, { merge: true });
  }

  await batch.commit();

  return {
    scannedEvents: events.length,
    entities: map.size,
    profilesUpserted: profiles.length,
    actionsCreated: actions.length,
  };
}
