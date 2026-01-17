import { ModuleShell } from '@/components/module-shell';

export default function APIAccessPage() {
  return (
    <ModuleShell
      title="API Access"
      description="Secure endpoints for events, segments, and lead routing."
      actions={[
        { label: 'Back to integrations', href: '/integrations', variant: 'outline' }
      ]}
    />
  );
}
