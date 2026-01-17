import { getAdminDb } from '@/server/firebase-admin';

type GlobalSignal = {
  id: string;
  topic: string;
  source: 'audience_actions';
  signalType: 'action';
  weight: number;
  windowDays: number;
  createdAt: number;
  updatedAt: number;
};

export async function rollupAudienceGlobal(params?: { withinDays?: number; limit?: number }) {
  const db = getAdminDb();
  const now = Date.now();
  const withinDays = Math.min(Math.max(params?.withinDays ?? 30, 1), 365);
  const limit = Math.min(Math.max(params?.limit ?? 2000, 1), 10000);
  const cutoff = now - withinDays * 24 * 60 * 60 * 1000;

  const snap = await db
    .collectionGroup('audience_actions')
    .where('createdAt', '>=', cutoff)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  const counts = new Map<string, number>();
  for (const doc of snap.docs) {
    const data = doc.data() as { type?: string };
    const topic = data?.type ? String(data.type) : 'unknown';
    counts.set(topic, (counts.get(topic) || 0) + 1);
  }

  const batch = db.batch();
  const signals: GlobalSignal[] = [];
  for (const [topic, weight] of counts.entries()) {
    const id = `global_${topic}`;
    const signal: GlobalSignal = {
      id,
      topic,
      source: 'audience_actions',
      signalType: 'action',
      weight,
      windowDays: withinDays,
      createdAt: now,
      updatedAt: now,
    };
    batch.set(db.collection('audiences_global').doc(id), signal, { merge: true });
    signals.push(signal);
  }

  if (signals.length > 0) {
    await batch.commit();
  }

  return {
    ok: true,
    windowDays: withinDays,
    scannedActions: snap.size,
    signals,
  };
}
