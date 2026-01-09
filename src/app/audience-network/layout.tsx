import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buyer Audience Network | Entrestate',
  description:
    'Invite-only audience pool or bring your own list. Simple, compliant outreach for brokers.',
  alternates: {
    canonical: '/audience-network',
  },
  openGraph: {
    title: 'Buyer Audience Network | Entrestate',
    description:
      'Invite-only audience pool or bring your own list. Simple, compliant outreach for brokers.',
    url: '/audience-network',
  },
};

export default function AudienceNetworkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
