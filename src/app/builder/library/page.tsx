import { ModuleShell } from '@/components/module-shell';

export default function BuilderLibraryPage() {
  return (
    <ModuleShell
      title="Builder Library"
      description="Reusable blocks, assets, and surface templates."
      actions={[
        { label: 'Open builder', href: '/builder', variant: 'outline' },
      ]}
    />
  );
}
