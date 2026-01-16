import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support | Entrestate',
  description: 'Get help with setup, leads, ads, and the chat assistant.',
  alternates: {
    canonical: '/support',
  },
  openGraph: {
    title: 'Support | Entrestate',
    description: 'Get help with setup, leads, ads, and the chat assistant.',
    url: '/support',
  },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
