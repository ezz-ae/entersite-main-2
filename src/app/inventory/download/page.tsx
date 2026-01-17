import { ModuleShell } from '@/components/module-shell';

export default function InventoryDownloadPage() {
  return (
    <ModuleShell
      title="Inventory Download"
      description="Access to the full market dataset is available with an active subscription."
      actions={[
        { label: 'View inventory', href: '/inventory', variant: 'outline' },
        { label: 'Upgrade access', href: '/account/billing' },
      ]}
    />
  );
}
