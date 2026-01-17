'use client';

import React from 'react';
import { BillingManager } from '@/components/dashboard/billing/billing-manager';

export default function AccountBillingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Billing & Invoices</h2>
        <p className="text-sm text-zinc-400">Manage plans, usage, VAT, and invoices.</p>
      </div>
      <BillingManager />
    </div>
  );
}
