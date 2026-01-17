import { googleAdsService } from '@/server/ads/google/googleAdsService';
import { notFound } from 'next/navigation';
import { CampaignCockpit } from '@/components/ads/google/CampaignCockpit';

interface PageProps {
  params: {
    campaignId: string;
  };
}

// In a real app, resolve tenantId from auth context
const MOCK_TENANT_ID = 'tenant_default';

export default async function CampaignPage({ params }: PageProps) {
  const campaign = await googleAdsService.getCampaign(MOCK_TENANT_ID, params.campaignId);

  if (!campaign) {
    notFound();
  }

  return <CampaignCockpit initialCampaign={campaign} />;
}