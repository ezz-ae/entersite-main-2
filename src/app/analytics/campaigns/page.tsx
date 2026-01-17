import { ModuleShell } from '@/components/module-shell';

export default function CampaignAnalyticsPage() {
  return (
    <ModuleShell
      title="Campaign Analytics"
      description="Campaign performance and spend health indicators."
      actions={[
        { label: 'Back to analytics', href: '/analytics', variant: 'outline' }
      ]}
    />
  );
}
