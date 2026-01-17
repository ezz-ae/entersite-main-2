import { ModulePlaceholder, formatSlugTitle } from '@/components/module-placeholder';

export default async function GoogleAdsSubpage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <ModulePlaceholder
      module="Google Ads"
      homeHref="/google-ads"
      title={formatSlugTitle(slug)}
      description="Campaign planning, performance, and intent insights live here."
    />
  );
}
