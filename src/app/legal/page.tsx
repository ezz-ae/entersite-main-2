import { ModuleShell } from '@/components/module-shell';

export default function LegalPage() {
  return (
    <ModuleShell
      title="Legal & Control"
      description="Terms, privacy, compliance, and data usage policies."
      actions={[
        { label: 'Terms', href: '/legal/terms', variant: 'outline' },
        { label: 'Privacy', href: '/legal/privacy' },
      ]}
    />
  );
}
