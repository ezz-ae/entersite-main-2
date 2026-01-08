import type { Firestore } from 'firebase-admin/firestore';
import { DEFAULT_MARKETING_METRICS, type MarketingMetricsSnapshot } from '@/data/marketing-metrics';

const ANALYTICS_COLLECTION = 'analytics';
const MARKETING_DOC = 'marketing';

type Totals = MarketingMetricsSnapshot['totals'];

export async function updateMarketingTotals(
  db: Firestore,
  tenantId: string,
  mutate: (totals: Totals) => Totals | void,
) {
  const docRef = db.collection('tenants').doc(tenantId).collection(ANALYTICS_COLLECTION).doc(MARKETING_DOC);
  const snapshot = await docRef.get();
  const existing = snapshot.exists ? (snapshot.data() as MarketingMetricsSnapshot) : undefined;
  const baseTotals: Totals = {
    ...DEFAULT_MARKETING_METRICS.totals,
    ...(existing?.totals || {}),
  };
  const nextTotals = mutate({ ...baseTotals }) ?? baseTotals;

  await docRef.set(
    {
      ...DEFAULT_MARKETING_METRICS,
      ...(existing || {}),
      totals: nextTotals,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}
