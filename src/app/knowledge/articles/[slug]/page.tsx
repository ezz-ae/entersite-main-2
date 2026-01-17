import { ModuleShell } from '@/components/module-shell';

export default function KnowledgeArticlePage() {
  return (
    <ModuleShell
      title="Knowledge Article"
      description="Broker-written article detail."
      actions={[
        { label: 'Back to knowledge', href: '/knowledge', variant: 'outline' }
      ]}
    />
  );
}
