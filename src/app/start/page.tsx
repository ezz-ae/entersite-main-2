import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';

export default function StartPage() {
  return (
    <main className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <OnboardingFlow />
      </div>
    </main>
  );
}
