'use client';

import React from 'react';
import { DashboardCards } from '@/components/dashboard/dashboard-cards';

export default function DashboardPage() {
  return (
    <div className="space-y-12">
         <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-xl text-muted-foreground font-light">Choose what you want to work on today.</p>
        </div>
        <DashboardCards />
    </div>
  );
}
