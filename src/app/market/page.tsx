import { ModuleShell } from '@/components/module-shell';

export default function MarketPage() {
  return (
    <ModuleShell
      title="Market"
      description="Market history, pricing movement, and demand signals for confident launches."
      actions={[
        { label: 'Market history', href: '/market/history', variant: 'outline' },
        { label: 'Demand signals', href: '/market/demand' },
      ]}
    />
  );
}
