export interface MarketingCampaign {
  name: string;
  status: 'Active' | 'Paused';
  dailyBudget: number; // currency value per day
  conversions?: number;
  leadsCaptured?: number;
  revenue?: number;
  roas?: number;
}

export interface MarketingRecommendation {
  title: string;
  description: string;
  actionLabel?: string;
}

export interface MarketingMetricsSnapshot {
  currencySymbol: string;
  totals: {
    adSpend: number;
    adSpendChange: number; // delta percentage (0.15 -> +15%)
    cpl: number;
    cplChange: number;
    conversions: number;
    conversionsChange: number;
    revenue: number;
    roas: number;
  };
  campaigns: MarketingCampaign[];
  recommendations: MarketingRecommendation[];
}

export const DEFAULT_MARKETING_METRICS: MarketingMetricsSnapshot = {
  currencySymbol: '$',
  totals: {
    adSpend: 12450,
    adSpendChange: 0.15,
    cpl: 24.5,
    cplChange: -0.05,
    conversions: 482,
    conversionsChange: 0.08,
    revenue: 58210,
    roas: 4.67,
  },
  campaigns: [
    { name: 'Dubai Luxury Launch', status: 'Active', dailyBudget: 50, conversions: 42, roas: 5.2 },
    { name: 'Emaar Beachfront', status: 'Paused', dailyBudget: 30, conversions: 18, roas: 3.4 },
    { name: 'General Branding', status: 'Active', dailyBudget: 20, conversions: 27, roas: 4.1 },
  ],
  recommendations: [
    {
      title: 'Increase Budget',
      description: 'Your "Luxury" campaign is pacing out mid-day. Increase by $10/day to unlock ~50 extra clicks.',
      actionLabel: 'Apply',
    },
  ],
};
