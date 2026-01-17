
import { getAdminDb } from '@/server/firebase-admin';
import { GoogleAdsCampaign, GoogleAdsCampaignSchema } from '@/types/ads';
import { z } from 'zod';

const CreateCampaignSchema = z.object({
  tenantId: z.string(),
  landingPageUrl: z.string().url().optional(),
});

export async function createCampaign(data: z.infer<typeof CreateCampaignSchema>): Promise<{ campaignId: string }> {
  const { tenantId, landingPageUrl } = CreateCampaignSchema.parse(data);
  const firestore = getAdminDb();
  const campaignRef = firestore.collection(`tenants/${tenantId}/ads_google_campaigns`).doc();
  const campaignId = campaignRef.id;

  const newCampaign: Partial<GoogleAdsCampaign> = {
    campaignId,
    tenantId,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'draft',
    landingPageUrl,
  };

  await campaignRef.set(newCampaign);

  return { campaignId };
}

export async function getCampaign(tenantId: string, campaignId: string): Promise<GoogleAdsCampaign | null> {
  const firestore = getAdminDb();
  const campaignRef = firestore.doc(`tenants/${tenantId}/ads_google_campaigns/${campaignId}`);
  const snapshot = await campaignRef.get();

  if (!snapshot.exists) {
    return null;
  }

  const parseResult = GoogleAdsCampaignSchema.safeParse(snapshot.data());
  if (!parseResult.success) {
    console.error(`Failed to parse campaign ${campaignId} for tenant ${tenantId}:`, parseResult.error);
    return null;
  }

  return parseResult.data;
}

export async function updateCampaign(
  tenantId: string,
  campaignId: string,
  data: Partial<GoogleAdsCampaign>
): Promise<void> {
  const firestore = getAdminDb();
  const campaignRef = firestore.doc(`tenants/${tenantId}/ads_google_campaigns/${campaignId}`);
  await campaignRef.update({ ...data, updatedAt: new Date() });
}

export async function listCampaigns(tenantId: string): Promise<GoogleAdsCampaign[]> {
  const firestore = getAdminDb();
  const campaignsRef = firestore.collection(`tenants/${tenantId}/ads_google_campaigns`);
  const snapshot = await campaignsRef.get();
  return snapshot.docs.map(doc => {
    const parseResult = GoogleAdsCampaignSchema.safeParse(doc.data());
    if (!parseResult.success) {
      console.error(`Failed to parse campaign ${doc.id} for tenant ${tenantId}:`, parseResult.error);
      return null;
    }
    return parseResult.data;
  }).filter((c): c is GoogleAdsCampaign => c !== null);
}
