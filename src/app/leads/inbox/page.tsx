import { ModuleShell } from '@/components/module-shell';

export default function LeadsInboxPage() {
  return (
    <ModuleShell
      title="Lead Inbox"
      description="Central inbox for new, active, and revived leads."
      actions={[{ label: 'Back to leads', href: '/leads', variant: 'outline' }]}
    />
  );
}
