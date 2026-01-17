import { ModuleShell } from '@/components/module-shell';

export default function AgencyDashboardPage() {
  return (
    <ModuleShell
      title="Agency Workspace"
      description="Manage client audiences, assigned agents, and campaign pools."
      actions={[
        { label: 'Back to agencies', href: '/agencies', variant: 'outline' }
      ]}
    />
  );
}
