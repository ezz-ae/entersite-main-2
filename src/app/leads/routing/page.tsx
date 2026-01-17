import { ModuleShell } from '@/components/module-shell';

export default function LeadRoutingPage() {
  return (
    <ModuleShell
      title="Routing & Assignment"
      description="Assign leads to agents with clear ownership rules."
      actions={[{ label: 'Back to leads', href: '/leads', variant: 'outline' }]}
    />
  );
}
