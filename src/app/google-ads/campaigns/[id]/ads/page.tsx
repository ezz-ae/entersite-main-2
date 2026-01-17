import Page from '@/app/dashboard/campaigns/[id]/ads/page';

export default function CampaignSubPage({ params }: { params: Promise<{ id: string }> }) {
  return <Page params={params} />;
}
