import { ModuleShell } from '@/components/module-shell';

export default async function MarketCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const cityName = decodeURIComponent(city);
  return (
    <ModuleShell
      title={`Market: ${cityName}`}
      description="Signals, history, and campaign entry points for this market."
      actions={[
        { label: 'View Market', href: '/market', variant: 'outline' },
        { label: 'Run a campaign', href: '/google-ads' },
      ]}
    />
  );
}
