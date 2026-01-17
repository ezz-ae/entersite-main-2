import { ModuleShell } from '@/components/module-shell';

export default async function MarketCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const cityName = decodeURIComponent(city);
  return (
    <ModuleShell
      title={`Market: ${cityName}`}
      description="City-level demand, delivery speed, and pricing momentum."
      actions={[{ label: 'Run a campaign', href: '/google-ads' }]}
    />
  );
}
