import { apiFetch } from './apiFetch';

export interface MarketingPlanParameters {
  siteType?: string;
  pageTitle?: string;
  projectName?: string;
  developerName?: string;
  locationCity?: string;
  adCampaignConfig?: {
    budget?: number;
    keywords?: string[];
  };
  [key: string]: any;
}

export interface StoredMarketingPlan {
  id: string;
  prompt: string;
  audience?: string | null;
  context?: Record<string, unknown> | null;
  response: {
    text: string;
    parameters: MarketingPlanParameters;
    isEndInteraction: boolean;
  };
  createdAt: string;
}

export async function fetchMarketingPlans(): Promise<StoredMarketingPlan[]> {
  try {
    const res = await apiFetch('/api/agents/marketing/plans');
    if (!res.ok) {
      throw new Error('Failed to fetch marketing plans');
    }
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to load marketing plans', error);
    return [];
  }
}
