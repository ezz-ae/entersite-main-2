import { ModuleShell } from '@/components/module-shell';

export default function SenderNewPage() {
  return (
    <ModuleShell
      title="Create Sequence"
      description="Draft a new sequence with email, SMS, and WhatsApp steps."
      actions={[
        { label: 'View queue', href: '/sender/queue', variant: 'outline' },
      ]}
    />
  );
}
