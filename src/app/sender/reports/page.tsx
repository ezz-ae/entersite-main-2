import { ModuleShell } from '@/components/module-shell';

export default function SenderReportsPage() {
  return (
    <ModuleShell
      title="Sender Reports"
      description="Delivery, open, and reply performance for active sequences."
      actions={[
        { label: 'Runs & queue', href: '/sender/queue', variant: 'outline' },
      ]}
    />
  );
}
