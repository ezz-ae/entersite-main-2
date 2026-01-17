import { ModulePlaceholder, formatSlugTitle } from '@/components/module-placeholder';

export default async function BuilderSubpage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <ModulePlaceholder
      module="Site Builder"
      homeHref="/builder"
      title={formatSlugTitle(slug)}
      description="Builder workflows, templates, and refiner checks live here."
    />
  );
}
