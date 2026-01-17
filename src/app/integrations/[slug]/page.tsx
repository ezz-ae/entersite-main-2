import { ModulePlaceholder, formatSlugTitle } from '@/components/module-placeholder';

export default async function IntegrationsSubpage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <ModulePlaceholder
      module="Integrations"
      homeHref="/integrations"
      title={formatSlugTitle(slug)}
      description="CRM, messaging, and webhook connections live here."
    />
  );
}
