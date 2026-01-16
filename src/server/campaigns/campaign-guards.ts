import { getAdminDb } from '@/server/firebase-admin';

export async function assertCampaignOwnedByTenant(params: {
  campaignId: string;
  tenantId: string;
}) {
  const db = getAdminDb();
  const ref = db.collection('campaigns').doc(params.campaignId);
  const snap = await ref.get();

  if (!snap.exists) throw new Error('Campaign not found');

  const data = snap.data() as any;
  if (data?.tenantId !== params.tenantId) throw new Error('Forbidden');

  return { ref, data };
}
