'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SmsCampaignDashboard } from '@/components/messaging/sms-dashboard';

export default function SmsStartPage() {
  return (
    <main className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-6 max-w-6xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">SMS Campaign</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Send a quick SMS blast.</h1>
            <p className="text-zinc-400 text-base mt-2">Choose your list, write a short message, and send.</p>
          </div>
          <Button asChild variant="outline" className="h-11 px-5 rounded-full border-white/10 bg-white/5">
            <Link href="/start">Back to Get Started</Link>
          </Button>
        </div>
        <SmsCampaignDashboard />
      </div>
    </main>
  );
}
