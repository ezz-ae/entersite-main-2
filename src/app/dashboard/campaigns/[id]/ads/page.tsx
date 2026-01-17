import { GoogleAdsDashboard } from '@/components/google-ads/google-ads-dashboard';

export default async function CampaignAdsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="p-6 bg-zinc-950 min-h-screen text-white">
      <GoogleAdsDashboard campaignId={id} />
    </div>
  );
}
