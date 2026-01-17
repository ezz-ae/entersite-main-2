import { ModulePlaceholder, formatSlugTitle } from '@/components/module-placeholder';

export default async function AnalyticsSubpage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <ModulePlaceholder
      module="Analytics"
      homeHref="/analytics"
      title={formatSlugTitle(slug)}
      description="Performance, cohorts, and quality index insights live here."
    />
  );
}
