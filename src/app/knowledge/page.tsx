import { ModuleShell } from '@/components/module-shell';

export default function KnowledgePage() {
  return (
    <ModuleShell
      title="Knowledge"
      description="Broker-first playbooks and trusted guides."
      actions={[
        { label: 'Playbook', href: '/knowledge/playbook', variant: 'outline' },
        { label: 'Guides', href: '/knowledge/guides', variant: 'outline' }
      ]}
    />
  );
}
