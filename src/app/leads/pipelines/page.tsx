import { ModuleShell } from '@/components/module-shell';

export default function LeadPipelinesPage() {
  return (
    <ModuleShell
      title="Lead Pipelines"
      description="Organize pipelines by source and intent level."
      actions={[
        { label: 'Back to leads', href: '/leads', variant: 'outline' }
      ]}
    />
  );
}
