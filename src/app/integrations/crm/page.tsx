import { ModuleShell } from '@/components/module-shell';

export default function CRMIntegrationsPage() {
  return (
    <ModuleShell
      title="CRM Integrations"
      description="Sync leads with HubSpot, Zoho, or your chosen CRM."
      actions={[
        { label: 'Back to integrations', href: '/integrations', variant: 'outline' }
      ]}
    />
  );
}
