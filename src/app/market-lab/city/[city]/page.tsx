import { ModuleShell } from '@/components/module-shell';

export default async function MarketLabCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const cityName = decodeURIComponent(city);
  return (
    <ModuleShell
      title={`Market Lab: ${cityName}`}
      description="City-level demand, delivery speed, and pricing momentum."
      actions={[{ label: 'Run a campaign', href: '/google-ads' }]}
    />
  );
}
