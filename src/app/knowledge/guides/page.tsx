import { ModuleShell } from '@/components/module-shell';

export default function KnowledgeGuidesPage() {
  return (
    <ModuleShell
      title="Knowledge Guides"
      description="Detailed guides for campaigns, inventory, and follow-up."
      actions={[
        { label: 'Back to knowledge', href: '/knowledge', variant: 'outline' }
      ]}
    />
  );
}
