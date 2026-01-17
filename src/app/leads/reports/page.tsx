import { ModuleShell } from '@/components/module-shell';

export default function LeadReportsPage() {
  return (
    <ModuleShell
      title="Lead Reports"
      description="Lead performance, response times, and conversion trends."
      actions={[{ label: 'Back to leads', href: '/leads', variant: 'outline' }]}
    />
  );
}
