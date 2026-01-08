'use client';

import React from 'react';
import { DashboardCards } from '@/components/dashboard/dashboard-cards';

export default function DashboardPage() {
  return (
    <div className="space-y-12">
         <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">Command Center</h1>
            <p className="text-xl text-muted-foreground font-light">Monitor and manage your real estate operations from one central hub.</p>
        </div>
        <DashboardCards />
    </div>
  );
}
