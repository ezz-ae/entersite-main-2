'use client';

import React from 'react';
import { GoogleAdsDashboard } from '@/components/google-ads/google-ads-dashboard';

export default function GoogleAdsStartPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-24">
        <GoogleAdsDashboard />
      </div>
    </div>
  );
}
