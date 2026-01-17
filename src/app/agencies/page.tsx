import { ModuleShell } from '@/components/module-shell';

export default function AgenciesPage() {
  return (
    <ModuleShell
      title="Agencies"
      description="Multi-tenant agency mode with client scopes and reporting."
      actions={[
        { label: 'Request access', href: '/agencies/request' }
      ]}
    />
  );
}
