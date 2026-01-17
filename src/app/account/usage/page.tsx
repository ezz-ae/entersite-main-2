import { ModuleShell } from '@/components/module-shell';

export default function UsagePage() {
  return (
    <ModuleShell
      title="Usage"
      description="Usage counters and capacity controls."
      actions={[{ label: 'Back to control room', href: '/account', variant: 'outline' }]}
    />
  );
}
