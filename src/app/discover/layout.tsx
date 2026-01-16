import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Market Feed | Entrestate',
  description:
    'Browse project listings, pricing ranges, and handover timelines from your inventory sources.',
  alternates: {
    canonical: '/discover',
  },
  openGraph: {
    title: 'Market Feed | Entrestate',
    description:
      'Browse project listings, pricing ranges, and handover timelines from your inventory sources.',
    url: '/discover',
  },
};

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return children;
}
