import { ModuleShell } from '@/components/module-shell';

export default function InstagramIntegrationPage() {
  return (
    <ModuleShell
      title="Instagram Integration"
      description="Route IG inquiries into Chat Agent and Smart Sender."
      actions={[
        { label: 'Back to integrations', href: '/integrations', variant: 'outline' }
      ]}
    />
  );
}
