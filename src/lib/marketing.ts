import { apiFetch } from './apiFetch';
import { DEFAULT_MARKETING_METRICS, MarketingMetricsSnapshot } from '@/data/marketing-metrics';

export async function fetchMarketingMetrics(tenantId?: string): Promise<MarketingMetricsSnapshot> {
  const params = new URLSearchParams();
  if (tenantId) {
    params.set('tenantId', tenantId);
  }
  const url = params.size ? `/api/marketing/metrics?${params.toString()}` : '/api/marketing/metrics';

  try {
    const response = await apiFetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch marketing metrics');
    }
    const data = await response.json();
    return data.data || DEFAULT_MARKETING_METRICS;
  } catch (error) {
    console.error('Failed to load marketing metrics', error);
    return DEFAULT_MARKETING_METRICS;
  }
}
