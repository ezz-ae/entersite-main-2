import type { ProjectData } from './types';

export interface ProjectFilter {
  city?: string;
  developer?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  availability?: 'Available' | 'Sold Out' | 'Coming Soon';
}

const DEFAULT_LIMIT = 25;

export const searchProjects = async (query: string, filters?: ProjectFilter): Promise<ProjectData[]> => {
  const params = new URLSearchParams();
  if (query) params.set('query', query);
  if (filters?.city) params.set('city', filters.city);
  if (filters?.developer) params.set('developer', filters.developer);
  if (filters?.availability) params.set('status', filters.availability);
  if (filters?.minPrice) params.set('minPrice', String(filters.minPrice));
  if (filters?.maxPrice) params.set('maxPrice', String(filters.maxPrice));
  params.set('limit', String(DEFAULT_LIMIT));

  const res = await fetch(`/api/projects/search?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to search projects');
  }

  const data = await res.json();
  return data.data || [];
};

export const getDevelopers = async (): Promise<string[]> => {
    const res = await fetch('/api/projects/meta', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.developers || [];
}

export const getLocations = async (): Promise<{city: string, areas: string[]}[]> => {
    const res = await fetch('/api/projects/meta', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.locations || [];
}
