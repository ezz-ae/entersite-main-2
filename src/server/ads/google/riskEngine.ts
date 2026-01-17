import { GoogleAdsCampaign } from '@/types/ads';

export interface RiskEvaluation {
  triggered: boolean;
  action?: 'pause' | 'lowerBudget' | 'suggestLandingShift' | 'suggestAutoRedesign';
  reason?: string;
  metricValue?: number;
}

export function evaluateRiskRules(campaign: GoogleAdsCampaign): RiskEvaluation {
  if (!campaign.riskControl?.enabled) {
    return { triggered: false };
  }

  const { metric, minimum, response, windowDays } = campaign.riskControl;
  
  // Mock metric retrieval (since we don't have real analytics hooked up yet)
  // In real app, this would query the reporting collection or external API
  let currentValue = 0;
  
  if (process.env.ADS_MOCK_MODE === 'true') {
    // Deterministic mock: if campaignId contains 'risk', trigger it
    if (campaign.campaignId.includes('risk')) {
        currentValue = minimum - 1;
    } else {
        currentValue = minimum + 10;
    }
  } else {
    // Fallback for "real" mode without real data yet
    const leads = campaign.reporting?.last30d?.leads || 0;
    // Rough scaling
    const scale = (windowDays || 7) / 30;
    if (metric === 'leads') currentValue = Math.round(leads * scale);
    // visits/clicks default to 0 for now
  }

  if (currentValue < minimum) {
    return {
      triggered: true,
      action: response,
      reason: `Metric ${metric} (${currentValue}) is below minimum threshold (${minimum}) over ${windowDays} days.`,
      metricValue: currentValue
    };
  }

  return { triggered: false };
}