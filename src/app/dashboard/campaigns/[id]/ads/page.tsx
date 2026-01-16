import { GoogleAdsDashboard } from '@/components/google-ads/google-ads-dashboard';

export default function CampaignAdsPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 bg-zinc-950 min-h-screen text-white">
      <GoogleAdsDashboard campaignId={params.id} />
    </div>
  );
}
