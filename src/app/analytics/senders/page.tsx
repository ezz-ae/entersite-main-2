import { ModuleShell } from '@/components/module-shell';

export default function SenderAnalyticsPage() {
  return (
    <ModuleShell
      title="Sender Analytics"
      description="Delivery, open, and reply performance across channels."
      actions={[
        { label: 'Back to analytics', href: '/analytics', variant: 'outline' }
      ]}
    />
  );
}
