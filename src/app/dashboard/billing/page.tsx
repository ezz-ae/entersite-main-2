'use client';

import React from 'react';
import { BillingManager } from '@/components/dashboard/billing/billing-manager';

export default function BillingPage() {
  return (
    <div className="container mx-auto py-12 px-6">
      <div className="mb-12 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-blue-500" stroke="currentColor" strokeWidth="2"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
        </div>
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Billing & License</h1>
            <p className="text-xl text-muted-foreground font-light">Manage your subscription and usage limits.</p>
        </div>
      </div>
      
      <BillingManager />
    </div>
  );
}
