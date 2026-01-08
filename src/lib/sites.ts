import { authorizedFetch } from './auth-fetch';

export interface SiteStats {
  leads: number;
  views: number;
}

export type SiteStatsMap = Record<string, SiteStats>;

export async function fetchSiteStats(siteIds: string[]): Promise<SiteStatsMap> {
  if (!siteIds.length) {
    return {};
  }
  const response = await authorizedFetch('/api/sites/stats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ siteIds }),
  });
  if (!response.ok) {
    throw new Error('Failed to load site stats');
  }
  const data = await response.json();
  return (data?.data as SiteStatsMap) || {};
}
