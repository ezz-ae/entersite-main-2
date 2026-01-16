import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instagram Assistant Demo | Entrestate',
  description: 'See how the assistant qualifies leads and captures contact details.',
  alternates: {
    canonical: '/instagram-assistant/demo',
  },
  openGraph: {
    title: 'Instagram Assistant Demo | Entrestate',
    description: 'See how the assistant qualifies leads and captures contact details.',
    url: '/instagram-assistant/demo',
  },
};

export default function InstagramAssistantDemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
