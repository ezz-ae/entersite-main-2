import Link from 'next/link';
import { ModuleShell } from '@/components/module-shell';

const SEQUENCE_ACTIONS = [
  {
    title: 'Create sequence',
    description: 'Draft a new flow that adapts across email, SMS, and WhatsApp.',
    href: '/sender/new',
  },
  {
    title: 'Runs & queue',
    description: 'Track every run and retry failed steps with full context.',
    href: '/sender/queue',
  },
  {
    title: 'Handoff tickets',
    description: 'Move high-intent leads to a human and suppress automation.',
    href: '/sender/handoff',
  },
];

export default function SenderSequencesPage() {
  return (
    <ModuleShell
      title="Sequences"
      description="Draft and review the messaging flows for each campaign."
      actions={[
        { label: 'Create sequence', href: '/sender/new' },
        { label: 'View queue', href: '/sender/queue', variant: 'outline' },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {SEQUENCE_ACTIONS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition hover:border-zinc-600"
          >
            <div className="text-sm font-semibold text-zinc-100">{card.title}</div>
            <div className="mt-2 text-sm text-zinc-400">{card.description}</div>
            <div className="mt-4 text-xs uppercase tracking-[0.3em] text-zinc-500 group-hover:text-zinc-300">
              Open
            </div>
          </Link>
        ))}
      </div>
    </ModuleShell>
  );
}
