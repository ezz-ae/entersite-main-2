import { ModuleShell } from '@/components/module-shell';

export default function MarketLabPage() {
  return (
    <ModuleShell
      title="Market Lab"
      description="Signals, pricing movement, and demand history tied to campaign intent."
      actions={[
        { label: 'Compare areas', href: '/market/compare', variant: 'outline' },
        { label: 'Run a campaign', href: '/google-ads' },
      ]}
    />
  );
}
