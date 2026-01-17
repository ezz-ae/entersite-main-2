import { ModulePlaceholder, formatSlugTitle } from '@/components/module-placeholder';

export default async function MarketSubpage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <ModulePlaceholder
      module="Market"
      homeHref="/market"
      title={formatSlugTitle(slug)}
      description="Market history, signals, and pricing movement live here."
    />
  );
}
