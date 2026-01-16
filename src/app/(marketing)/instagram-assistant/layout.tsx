import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instagram Assistant for Real Estate Brokers | Entrestate',
  description:
    'Reply to Instagram DMs instantly, qualify buyers, and hand off leads to your team.',
  alternates: {
    canonical: '/instagram-assistant',
  },
  openGraph: {
    title: 'Instagram Assistant for Real Estate Brokers | Entrestate',
    description:
      'Reply to Instagram DMs instantly, qualify buyers, and hand off leads to your team.',
    url: '/instagram-assistant',
  },
};

export default function InstagramAssistantLayout({ children }: { children: React.ReactNode }) {
  return children;
}
