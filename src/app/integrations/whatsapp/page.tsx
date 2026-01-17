import { ModuleShell } from '@/components/module-shell';

export default function WhatsAppIntegrationPage() {
  return (
    <ModuleShell
      title="WhatsApp Integration"
      description="Connect WhatsApp numbers for lead replies and handoffs."
      actions={[
        { label: 'Back to integrations', href: '/integrations', variant: 'outline' }
      ]}
    />
  );
}
