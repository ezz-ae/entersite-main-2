import { GoogleAdsCampaign } from '@/types/ads';

export interface RefinerIssue {
  id: string;
  severity: 'critical' | 'warning';
  message: string;
}

export interface RefinerResult {
  passed: boolean;
  issues: RefinerIssue[];
  suggestions: string[];
}

export function runRefiner(campaign: GoogleAdsCampaign): RefinerResult {
  const issues: RefinerIssue[] = [];
  const suggestions: string[] = [];

  // 1. Structural / Configuration Checks
  if (!campaign.landingPageUrl) {
    issues.push({
      id: 'missing_url',
      severity: 'critical',
      message: 'Landing page URL is missing.',
    });
  } else if (!campaign.landingPageUrl.startsWith('http')) {
    issues.push({
      id: 'invalid_url',
      severity: 'critical',
      message: 'Landing page URL must be a valid HTTP/HTTPS link.',
    });
  }

  if (!campaign.planner?.cityArea) {
    issues.push({
      id: 'missing_area',
      severity: 'critical',
      message: 'Target city/area is not defined.',
    });
  }

  if ((campaign.planner?.dailyBudgetAED || 0) < 50) {
    issues.push({
      id: 'low_budget',
      severity: 'warning',
      message: 'Daily budget is below the recommended 50 AED minimum.',
    });
  }

  // 2. Heuristic Checks (V1 Mock/Static Analysis)
  // In a real implementation, this would fetch the page content.
  
  if (campaign.planner?.contactRoute === 'WhatsApp') {
    suggestions.push('Ensure the WhatsApp floating button is visible on mobile devices.');
  }

  if (!campaign.intercept?.enabled) {
    suggestions.push('Competitor Intercept is disabled. Consider enabling it to capture portal traffic.');
  }

  const passed = !issues.some(i => i.severity === 'critical');

  return {
    passed,
    issues,
    suggestions,
  };
}