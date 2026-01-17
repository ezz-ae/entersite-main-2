import { ModuleShell } from '@/components/module-shell';

export default function LeadSignalsPage() {
  return (
    <ModuleShell
      title="Lead Signals"
      description="Signal history and engagement indicators for each lead."
      actions={[{ label: 'Back to leads', href: '/leads', variant: 'outline' }]}
    />
  );
}
