import { ModuleShell } from '@/components/module-shell';

export default async function MarketAreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  const areaName = decodeURIComponent(area);
  return (
    <ModuleShell
      title={`Market: ${areaName}`}
      description="Area-level supply, demand, and launch opportunities."
      actions={[{ label: 'Run a campaign', href: '/google-ads' }]}
    />
  );
}
