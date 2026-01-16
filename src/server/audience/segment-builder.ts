import { getAdminDb } from '@/server/firebase-admin';
import type { AudienceSegment, AudienceSegmentTier, AudienceSegmentRule } from './segment-types';

type EntityKey = { kind: 'lead'; id: string } | { kind: 'anon'; id: string };

function entityKeyFromEvent(ev: any): EntityKey | null {
  const actor = ev?.actor;
  if (!actor) return null;
  if (actor.leadId) return { kind: 'lead', id: String(actor.leadId) };
  if (actor.fingerprint) return { kind: 'anon', id: String(actor.fingerprint) };
  return null;
}

function mkSegmentId(params: {
  scope: AudienceSegment['scope'];
  tier: AudienceSegmentTier;
  withinDays: number;
}) {
  const scopePart = params.scope.type === 'all' ? 'all' : `c_${params.scope.campaignId}`;
  return `${scopePart}__${params.tier}__${params.withinDays}d`;
}

export async function buildAudienceSegments(params: {
  tenantId: string;
  withinDays?: number;
  campaignId?: string;
}) {
  const db = getAdminDb();
  const withinDays = params.withinDays ?? 30;
  const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000;

  // Query events window (tenant scoped).
  let q: FirebaseFirestore.Query = db
    .collection('events')
    .where('tenantId', '==', params.tenantId)
    .where('ts', '>=', cutoff);

  if (params.campaignId) {
    q = q.where('campaignId', '==', params.campaignId);
  }

  // NOTE: For large tenants this should be moved to a background job with paging.
  const snap = await q.limit(5000).get();
  const events = snap.docs.map((d) => d.data());

  // Aggregate weights by entity.
  const weights = new Map<string, { entity: EntityKey; total: number }>();
  for (const ev of events) {
    const ek = entityKeyFromEvent(ev);
    if (!ek) continue;
    const key = `${ek.kind}:${ek.id}`;
    const w = Number(ev?.weight ?? 0) || 0;
    const prev = weights.get(key);
    if (prev) prev.total += w;
    else weights.set(key, { entity: ek, total: w });
  }

  const tiers: Array<{ tier: AudienceSegmentTier; rule: AudienceSegmentRule }> = [
    { tier: 'cold', rule: { minWeight: 3, withinDays } },
    { tier: 'warm', rule: { minWeight: 13, withinDays } },
    { tier: 'hot', rule: { minWeight: 21, withinDays } },
  ];

  const scope: AudienceSegment['scope'] = params.campaignId
    ? { type: 'campaign', campaignId: params.campaignId }
    : { type: 'all' };

  const now = Date.now();
  const segments: AudienceSegment[] = tiers.map(({ tier, rule }) => {
    let size = 0;
    let withLeadId = 0;
    let anonymous = 0;

    for (const { entity, total } of weights.values()) {
      if (total >= rule.minWeight) {
        size += 1;
        if (entity.kind === 'lead') withLeadId += 1;
        else anonymous += 1;
      }
    }

    return {
      id: mkSegmentId({ scope, tier, withinDays }),
      tenantId: params.tenantId,
      scope,
      tier,
      rule,
      size,
      breakdown: { withLeadId, anonymous },
      updatedAt: now,
    };
  });

  // Persist under tenant (derived data only; no PII stored).
  const batch = db.batch();
  for (const seg of segments) {
    const ref = db
      .collection('tenants')
      .doc(params.tenantId)
      .collection('audience_segments')
      .doc(seg.id);
    batch.set(ref, seg, { merge: true });
  }
  await batch.commit();

  return { segments, scannedEvents: events.length, entities: weights.size, withinDays };
}

export async function listAudienceSegments(params: {
  tenantId: string;
  campaignId?: string;
}) {
  const db = getAdminDb();
  let q: FirebaseFirestore.Query = db
    .collection('tenants')
    .doc(params.tenantId)
    .collection('audience_segments');

  if (params.campaignId) {
    // Filter client-side because Firestore doesn't support OR on union scope types.
    const snap = await q.orderBy('updatedAt', 'desc').get();
    return snap.docs
      .map((d) => d.data() as AudienceSegment)
      .filter((s) => s.scope?.type === 'campaign' && s.scope?.campaignId === params.campaignId);
  }

  const snap = await q.orderBy('updatedAt', 'desc').get();
  return snap.docs.map((d) => d.data() as AudienceSegment);
}
