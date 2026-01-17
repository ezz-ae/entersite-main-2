import { ModuleShell } from '@/components/module-shell';

export default function GoogleAdsPage() {
  return (
    <ModuleShell
      title="Google Ads"
      description="Launch high-intent search campaigns with a managed execution flow."
      actions={[
        { label: 'Start a campaign', href: '/google-ads/start' },
        { label: 'View campaigns', href: '/google-ads/campaigns', variant: 'outline' },
        { label: 'Reports', href: '/google-ads/reports', variant: 'outline' },
      ]}
    />
  );
}
