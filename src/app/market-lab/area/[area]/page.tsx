import { ModuleShell } from '@/components/module-shell';

export default async function MarketLabAreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  const areaName = decodeURIComponent(area);
  return (
    <ModuleShell
      title={`Market Lab: ${areaName}`}
      description="Area-level signals and pricing movement."
      actions={[{ label: 'Run a campaign', href: '/google-ads' }]}
    />
  );
}
