import { ModuleShell } from '@/components/module-shell';

export default function KnowledgePlaybookPage() {
  return (
    <ModuleShell
      title="Knowledge Playbook"
      description="Core broker workflows and market language."
      actions={[
        { label: 'Back to knowledge', href: '/knowledge', variant: 'outline' }
      ]}
    />
  );
}
