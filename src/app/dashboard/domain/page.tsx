'use client';

import React from 'react';
import { DomainDashboard } from '@/components/dashboard/domain/domain-dashboard';

export default function DomainPage() {
  return (
    <div className="container mx-auto py-10 px-6 max-w-[1800px]">
      <DomainDashboard />
    </div>
  );
}
