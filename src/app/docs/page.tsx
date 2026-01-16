import { DocsPageContent } from '@/components/docs/docs-page-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center | Entrestate',
  description: 'Quick start guides and support for brokers and teams.',
  alternates: {
    canonical: '/docs',
  },
  openGraph: {
    title: 'Help Center | Entrestate',
    description: 'Quick start guides and support for brokers and teams.',
    url: '/docs',
  },
};

export default function DocsPage() {
  return <DocsPageContent />;
}
