export type AudienceSegmentTier = 'cold' | 'warm' | 'hot';

export type AudienceSegmentRule = {
  /** Minimum cumulative weight to qualify. */
  minWeight: number;
  /** Window for inclusion (e.g., 30 days). */
  withinDays: number;
  /** Optional restriction to specific event types. */
  eventTypes?: string[];
};

export type AudienceSegment = {
  id: string;
  tenantId: string;
  scope: { type: 'all' } | { type: 'campaign'; campaignId: string };
  tier: AudienceSegmentTier;
  rule: AudienceSegmentRule;
  /** Count of unique entities in the segment (leadId or anonymous fingerprint). */
  size: number;
  /** Debug-only counters (safe: no PII). */
  breakdown?: {
    withLeadId: number;
    anonymous: number;
  };
  updatedAt: number;
};
