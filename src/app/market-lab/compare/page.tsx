import { ModuleShell } from '@/components/module-shell';

export default function MarketLabComparePage() {
  return (
    <ModuleShell
      title="Market Lab Comparison"
      description="Side-by-side market signals for priority areas."
      actions={[
        { label: 'Back to Market', href: '/market', variant: 'outline' },
      ]}
    />
  );
}
