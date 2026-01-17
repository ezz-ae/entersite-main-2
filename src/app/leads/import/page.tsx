import { ModuleShell } from '@/components/module-shell';

export default function LeadImportPage() {
  return (
    <ModuleShell
      title="Lead Import"
      description="Bring leads in from CSV, CRM, or partner channels."
      actions={[
        { label: 'Back to leads', href: '/leads', variant: 'outline' }
      ]}
    />
  );
}
