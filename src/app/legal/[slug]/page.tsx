import { ModulePlaceholder, formatSlugTitle } from '@/components/module-placeholder';

export default async function LegalSubpage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <ModulePlaceholder
      module="Legal & Control"
      homeHref="/legal"
      title={formatSlugTitle(slug)}
      description="Compliance, privacy, and data usage details live here."
    />
  );
}
