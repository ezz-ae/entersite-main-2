import { Suspense } from 'react';
import { LandingHero } from '@/components/marketing/landing-hero';

export function LandingHeroContainer() {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" />}> 
      <LandingHero />
    </Suspense>
  );
}
