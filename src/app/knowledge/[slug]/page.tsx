import { ModulePlaceholder, formatSlugTitle } from '@/components/module-placeholder';

export default async function KnowledgeSubpage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <ModulePlaceholder
      module="Knowledge"
      homeHref="/knowledge"
      title={formatSlugTitle(slug)}
      description="Playbooks, system guides, and broker education live here."
    />
  );
}
