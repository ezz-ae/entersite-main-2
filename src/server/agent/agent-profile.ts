import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import type { AgentProfile } from '@/lib/agent-profile';
import { mergeAgentProfile } from '@/lib/agent-profile';

const PROFILE_DOC_ID = 'default';

export async function getAgentProfile(tenantId: string): Promise<AgentProfile> {
  const db = getAdminDb();
  const ref = db.collection('tenants').doc(tenantId).collection('agent_profile').doc(PROFILE_DOC_ID);
  const snap = await ref.get();
  const data = snap.exists ? (snap.data() as Partial<AgentProfile>) : null;
  return mergeAgentProfile(data, null);
}

export async function saveAgentProfile(
  tenantId: string,
  patch: Partial<AgentProfile>,
): Promise<AgentProfile> {
  const db = getAdminDb();
  const ref = db.collection('tenants').doc(tenantId).collection('agent_profile').doc(PROFILE_DOC_ID);
  const snap = await ref.get();
  const existing = snap.exists ? (snap.data() as Partial<AgentProfile>) : null;
  const merged = mergeAgentProfile(existing, patch);

  const now = FieldValue.serverTimestamp();
  const payload: Record<string, unknown> = {
    ...merged,
    updatedAt: now,
  };
  if (!snap.exists) {
    payload.createdAt = now;
  }

  await ref.set(payload, { merge: true });
  return merged;
}
