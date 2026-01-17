import { getAdminDb } from '@/server/firebase-admin';
import type { AgentEvent } from '@/lib/agent-profile';

export async function listAgentEvents(tenantId: string, limit = 50): Promise<AgentEvent[]> {
  const db = getAdminDb();
  const snap = await db
    .collection('tenants')
    .doc(tenantId)
    .collection('agent_events')
    .orderBy('startAt', 'desc')
    .limit(limit)
    .get();

  return snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<AgentEvent, 'id'>) }));
}
