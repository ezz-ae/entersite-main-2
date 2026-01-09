import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Started | Entrestate',
  description: 'Choose your next step: website, chat assistant, SMS, email, or ads.',
  alternates: {
    canonical: '/start',
  },
  openGraph: {
    title: 'Get Started | Entrestate',
    description: 'Choose your next step: website, chat assistant, SMS, email, or ads.',
    url: '/start',
  },
};

export default function StartPage() {
  return (
    <main className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <OnboardingFlow />
      </div>
    </main>
  );
}
