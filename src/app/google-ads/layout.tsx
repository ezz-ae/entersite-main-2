import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Google Ads for Real Estate | Entrestate',
  description: 'Build an AI plan, launch ads without setup, and track leads in plain language.',
  alternates: {
    canonical: '/google-ads',
  },
  openGraph: {
    title: 'Google Ads for Real Estate | Entrestate',
    description: 'Build an AI plan, launch ads without setup, and track leads in plain language.',
    url: '/google-ads',
  },
};

export default function GoogleAdsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
