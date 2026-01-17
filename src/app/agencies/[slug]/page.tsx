import { ModulePlaceholder, formatSlugTitle } from '@/components/module-placeholder';

export default async function AgenciesSubpage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <ModulePlaceholder
      module="Agencies"
      homeHref="/agencies"
      title={formatSlugTitle(slug)}
      description="Agency oversight, client workspaces, and reports live here."
    />
  );
}
