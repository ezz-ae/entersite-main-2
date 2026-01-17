import { ModulePlaceholder, formatSlugTitle } from '@/components/module-placeholder';

export default async function InventorySubpage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <ModulePlaceholder
      module="Market Inventory"
      homeHref="/inventory"
      title={formatSlugTitle(slug)}
      description="Inventory views and availability signals load here."
    />
  );
}
