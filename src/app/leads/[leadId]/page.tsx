import { ModuleShell } from '@/components/module-shell';

export default function LeadDetailPage() {
  return (
    <ModuleShell
      title="Lead Detail"
      description="Full lead profile, activity log, and next action."
      actions={[
        { label: 'Back to leads', href: '/leads', variant: 'outline' }
      ]}
    />
  );
}
