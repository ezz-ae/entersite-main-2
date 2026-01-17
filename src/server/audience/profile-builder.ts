import { getAdminDb } from '@/server/firebase-admin';
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

export async function buildAudienceProfiles(params: {
  tenantId: string;
  withinDays?: number;
  campaignId?: string;
}) {
  const db = getAdminDb();
  const withinDays = params.withinDays ?? 30;
  const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000;

  let q: FirebaseFirestore.Query = db
    .collection('tenants')
    .doc(params.tenantId)
    .collection('events')
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
    const key = `${ek.kind}:${ek.id}`;
    const w = Number(ev?.weight ?? 0) || 0;
    const ts = Number(ev?.ts ?? 0) || 0;
    const campaignId = ev?.campaignId ? String(ev.campaignId) : undefined;

    const prev = map.get(key);
    if (prev) {
      prev.total += w;
      if (ts > prev.lastEventAt) {
        prev.lastEventAt = ts;
        prev.lastCampaignId = campaignId || prev.lastCampaignId;
      }
    } else {
      map.set(key, {
        entity: ek,
        total: w,
        lastEventAt: ts,
        lastCampaignId: campaignId,
      });
    }
  }

  const now = Date.now();
  const profiles: AudienceProfile[] = [];

  for (const [id, v] of map.entries()) {
    profiles.push({
      id,
      tenantId: params.tenantId,
      entity: v.entity,
      campaignId: v.lastCampaignId,
      withinDays,
      totalWeight: v.total,
      tier: tierFromWeight(v.total),
      lastEventAt: v.lastEventAt,
      updatedAt: now,
    });
  }

  // Upsert profiles under tenant (derived, no PII)
  const batch = db.batch();
  for (const p of profiles) {
    const ref = db
      .collection('tenants')
      .doc(params.tenantId)
      .collection('audience_profiles')
      .doc(p.id);
    batch.set(ref, p, { merge: true });
  }
  await batch.commit();

  return { profiles, scannedEvents: events.length, entities: map.size, withinDays };
}
