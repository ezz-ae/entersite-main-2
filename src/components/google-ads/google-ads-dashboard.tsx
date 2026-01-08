'use client';

import React, { useState, useEffect } from 'react';
import { CampaignWizard } from './campaign-wizard';
import { PerformanceDashboard } from './performance-dashboard';
import { Button } from '@/components/ui/button';
import { Plus, BarChart2 } from 'lucide-react';

export function GoogleAdsDashboard() {
  const [campaign, setCampaign] = useState<any>(null);
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'wizard'

  const handleCampaignCreated = (newCampaign: any) => {
    setCampaign(newCampaign);
    setView('dashboard');
  };

  const renderContent = () => {
    if (view === 'wizard') {
      return <CampaignWizard onCampaignCreated={handleCampaignCreated} />;
    }
    if (campaign) {
      return <PerformanceDashboard campaign={campaign} />;
    }
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-zinc-900/50 rounded-3xl border border-white/5">
        <h2 className="text-3xl font-bold mb-4 text-white">Launch Your First AI-Powered Ad Campaign</h2>
        <p className="text-zinc-400 mb-8 max-w-xl">Reach high-intent investors and drive targeted traffic to your properties with our automated Google Ads engine.</p>
        <Button onClick={() => setView('wizard')} className="gap-2 h-12 px-8 text-lg font-semibold">
          <Plus className="h-5 w-5" /> Create New Campaign
        </Button>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Google Ads <span className="text-zinc-600">Command</span></h1>
        {view === 'dashboard' && (
          <Button onClick={() => setView('wizard')} className="gap-2">
            <Plus className="h-4 w-4" /> Create New Campaign
          </Button>
        )}
        {view === 'wizard' && (
          <Button onClick={() => setView('dashboard')} variant="outline" className="gap-2">
            <BarChart2 className="h-4 w-4" /> View Dashboard
          </Button>
        )}
      </header>
      <div className="mt-12">
        {renderContent()}
      </div>
    </div>
  );
}
