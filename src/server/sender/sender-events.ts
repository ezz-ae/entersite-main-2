import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import type { LeadDirection } from '@/lib/lead-direction';

export type SenderEventType =
  | 'sender.step.sent'
  | 'sender.step.skipped'
  | 'sender.step.failed'
  | 'sender.suppressed_hot'
  | 'sender.override';

export type SenderEventChannel = 'email' | 'sms' | 'whatsapp' | 'none';

export type SenderEvent = {
  id: string;
  tenantId: string;
  campaignId: string;
  leadId: string;
  runId: string;
  type: SenderEventType;
  stepIndex?: number | null;
  channel: SenderEventChannel;
  reason?: string | null;
  providerMessageId?: string | null;
  fairnessScore?: number | null;
  direction?: LeadDirection | null;
  hotScore?: number | null;
  createdAt: any;
};

export async function writeSenderEvent(input: Omit<SenderEvent, 'id' | 'createdAt'>) {
  const db = getAdminDb();
  const ref = db.collection('tenants').doc(input.tenantId).collection('senderEvents').doc();
  const payload: Omit<SenderEvent, 'id'> = {
    ...input,
    createdAt: FieldValue.serverTimestamp(),
  };
  await ref.set(payload, { merge: true });
  return { id: ref.id, ...payload };
}
