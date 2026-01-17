import { ModuleShell } from '@/components/module-shell';

export default function SenderPage() {
  return (
    <ModuleShell
      title="Smart Sender"
      description="Automated email, SMS, and WhatsApp sequences with guardrails."
      actions={[
        { label: 'Create sequence', href: '/sender/new' },
        { label: 'Sequences', href: '/sender/sequences', variant: 'outline' },
        { label: 'Runs & queue', href: '/sender/queue', variant: 'outline' },
        { label: 'Handoff tickets', href: '/sender/handoff', variant: 'outline' },
      ]}
    />
  );
}
