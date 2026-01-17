import { ModuleShell } from '@/components/module-shell';

export default function AgencyRequestPage() {
  return (
    <ModuleShell
      title="Agency Request"
      description="Submit your agency details to unlock the agency workspace."
      actions={[
        { label: 'Back to agencies', href: '/agencies', variant: 'outline' }
      ]}
    />
  );
}
