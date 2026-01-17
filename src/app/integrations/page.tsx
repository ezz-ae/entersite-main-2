import { ModuleShell } from '@/components/module-shell';

export default function IntegrationsPage() {
  return (
    <ModuleShell
      title="Integrations"
      description="Connect the system to inventory feeds, CRM, and communication channels."
      actions={[
        { label: 'CRM', href: '/integrations/crm', variant: 'outline' },
        { label: 'WhatsApp', href: '/integrations/whatsapp', variant: 'outline' },
        { label: 'Instagram', href: '/integrations/instagram', variant: 'outline' },
        { label: 'API', href: '/integrations/api', variant: 'outline' }
      ]}
    />
  );
}
