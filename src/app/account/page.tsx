import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const sections = [
  {
    href: '/account/profile',
    title: 'Profile & Company',
    description: 'Phone, name, and company profile used across modules.',
  },
  {
    href: '/account/billing',
    title: 'Billing & Invoices',
    description: 'Plans, spend controls, VAT, and invoice history.',
  },
  {
    href: '/account/usage',
    title: 'Usage',
    description: 'Usage counters, capacity, and limits.',
  },
  {
    href: '/account/integrations',
    title: 'Integrations',
    description: 'Connect inventory, CRM, and messaging channels.',
  },
  {
    href: '/account/team',
    title: 'Team',
    description: 'Manage seats and permissions (V2 light).',
  },
  {
    href: '/account/notifications',
    title: 'Notifications',
    description: 'Control alerts for leads, spend, and handoffs.',
  },
  {
    href: '/account/security',
    title: 'Security & Sessions',
    description: 'Active sessions and access controls.',
  },
  {
    href: '/account/support',
    title: 'Support',
    description: 'Get help or report issues.',
  },
];

export default function AccountOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Control Room</h2>
        <p className="text-sm text-zinc-400">
          This is where your identity, billing, and platform access are managed.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="block">
            <Card className="bg-black/20 border-white/10 hover:border-white/20 transition-colors">
              <CardHeader>
                <CardTitle className="text-base">{section.title}</CardTitle>
                <CardDescription className="text-zinc-500">{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">Open</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
