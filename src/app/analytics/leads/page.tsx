import { ModuleShell } from '@/components/module-shell';

export default function LeadAnalyticsPage() {
  return (
    <ModuleShell
      title="Lead Analytics"
      description="Lead velocity, quality tiers, and response tracking."
      actions={[
        { label: 'Back to analytics', href: '/analytics', variant: 'outline' }
      ]}
    />
  );
}
