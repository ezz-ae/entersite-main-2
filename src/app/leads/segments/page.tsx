import { ModuleShell } from '@/components/module-shell';

export default function LeadSegmentsPage() {
  return (
    <ModuleShell
      title="Lead Segments"
      description="Hot, warm, and cold segmentation with clear next steps."
      actions={[{ label: 'Back to leads', href: '/leads', variant: 'outline' }]}
    />
  );
}
