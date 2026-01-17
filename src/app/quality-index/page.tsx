import { ModuleShell } from '@/components/module-shell';

export default function QualityIndexPage() {
  return (
    <ModuleShell
      title="Quality Index"
      description="Lead quality, campaign health, page readiness, and agent readiness indicators."
      actions={[
        { label: 'View analytics', href: '/analytics', variant: 'outline' },
      ]}
    />
  );
}
