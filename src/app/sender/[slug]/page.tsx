import { ModulePlaceholder, formatSlugTitle } from '@/components/module-placeholder';

export default async function SenderSubpage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <ModulePlaceholder
      module="Smart Sender"
      homeHref="/sender"
      title={formatSlugTitle(slug)}
      description="Sender sequencing, queue, and suppression controls live here."
    />
  );
}
