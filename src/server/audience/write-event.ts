import { nanoid } from 'nanoid';
import { getAdminDb } from '@/server/firebase-admin';
import type { AudienceActor, AudienceEvent, AudienceEventType } from './event-types';
import { weightForEvent } from './weights';

// Single entry point for behavioral events.
// Privacy: do NOT send raw PII in payload; keep it anonymous or hashed.
export async function writeAudienceEvent(input: {
  tenantId: string;
  campaignId?: string | null;
  actor: AudienceActor;
  type: AudienceEventType;
  payload?: Record<string, unknown> | null;
}): Promise<AudienceEvent> {
  const db = getAdminDb();
  const id = nanoid();
  const ts = Date.now();

  const event: AudienceEvent = {
    id,
    tenantId: input.tenantId,
    campaignId: input.campaignId ? String(input.campaignId) : undefined,
    actor: input.actor,
    type: input.type,
    ts,
    weight: weightForEvent(input.type),
    payload: input.payload || undefined,
    privacy: { pii: false },
  };

  await db.collection('events').doc(id).set(event);
  return event;
}
