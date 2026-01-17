'use client';

import React from 'react';
import { DomainDashboard } from '@/components/dashboard/domain/domain-dashboard';

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Integrations</h2>
        <p className="text-sm text-zinc-400">Connect domains, inventory feeds, CRM, and messaging channels.</p>
      </div>
      <DomainDashboard />
    </div>
  );
}
