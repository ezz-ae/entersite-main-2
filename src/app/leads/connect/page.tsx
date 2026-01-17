import { ModuleShell } from '@/components/module-shell';

export default function LeadConnectPage() {
  return (
    <ModuleShell
      title="Export & CRM Connect"
      description="Connect external CRMs or export lead records on demand."
      actions={[{ label: 'Back to leads', href: '/leads', variant: 'outline' }]}
    />
  );
}
