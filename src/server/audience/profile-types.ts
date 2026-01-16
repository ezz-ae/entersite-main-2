export type AudienceTier = 'none' | 'cold' | 'warm' | 'hot';

export type AudienceEntityKey =
  | { kind: 'lead'; id: string }
  | { kind: 'anon'; id: string };

export type AudienceProfile = {
  id: string; // `${kind}:${id}`
  tenantId: string;
  entity: AudienceEntityKey;
  campaignId?: string; // best-effort: last seen campaign

  withinDays: number;
  totalWeight: number;
  tier: AudienceTier;
  lastEventAt: number;

  updatedAt: number;
};
