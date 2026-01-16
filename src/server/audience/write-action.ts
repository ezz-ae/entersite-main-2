import { getAdminDb } from '@/server/firebase-admin';
import type { AudienceAction, AudienceActionType } from './action-types';

export async function writeAudienceAction(input: {
  tenantId: string;
  campaignId?: string;
  entityId: string;
  type: AudienceActionType;
  fromTier?: AudienceAction['fromTier'];
  toTier?: AudienceAction['toTier'];
  payload?: Record<string, any>;
}) {
  const db = getAdminDb();
  const now = Date.now();
  const id = `act_${now}_${Math.random().toString(36).slice(2, 10)}`;
  const action: AudienceAction = {
    id,
    tenantId: input.tenantId,
    campaignId: input.campaignId,
    entityId: input.entityId,
    type: input.type,
    fromTier: input.fromTier,
    toTier: input.toTier,
    payload: input.payload || {},
    createdAt: now,
  };

  await db
    .collection('tenants')
    .doc(input.tenantId)
    .collection('audience_actions')
    .doc(id)
    .set(action, { merge: true });

  return action;
}
