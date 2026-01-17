import type { AudienceTier } from './profile-types';

export type AudienceActionType =
  | 'lead.became_hot'
  | 'sender.suppressed_hot'
  | 'sender.escalate_whatsapp'
  | 'notify.sales';

export type AudienceAction = {
  id: string;
  tenantId: string;
  campaignId?: string;
  entityId: string; // `${kind}:${id}`

  type: AudienceActionType;
  fromTier?: AudienceTier;
  toTier?: AudienceTier;

  payload?: Record<string, any>;
  createdAt: number;
};
