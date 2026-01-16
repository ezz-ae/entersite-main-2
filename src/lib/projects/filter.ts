import type { ProjectData } from '@/lib/types';

export interface ProjectSearchFilters {
  query?: string;
  city?: string | null;
  status?: string | null;
  developer?: string | null;
  minPrice?: number;
  maxPrice?: number;
}

function normalizeValue(value?: string | null) {
  return (value ?? '').trim().toLowerCase();
}

function normalizeKey(value?: string | null) {
  return (value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

export function filterProjects(projects: ProjectData[], filters: ProjectSearchFilters) {
  const query = normalizeValue(filters.query);
  const city = normalizeKey(filters.city);
  const developer = normalizeValue(filters.developer);
  const status = normalizeValue(filters.status);
  const minPrice = filters.minPrice && filters.minPrice > 0 ? filters.minPrice : undefined;
  const maxPrice = filters.maxPrice && filters.maxPrice > 0 ? filters.maxPrice : undefined;

  return projects.filter((project) => {
    if (query) {
      const matchesQuery =
        project.name.toLowerCase().includes(query) ||
        project.developer.toLowerCase().includes(query) ||
        project.location.city.toLowerCase().includes(query) ||
        project.location.area.toLowerCase().includes(query);
      if (!matchesQuery) {
        return false;
      }
    }

    if (filters.city && city !== 'all' && normalizeKey(project.location.city) !== city) {
      return false;
    }

    if (developer && !project.developer.toLowerCase().includes(developer)) {
      return false;
    }

    if (status && status !== 'all' && project.availability.toLowerCase() !== status) {
      return false;
    }

    if (minPrice && (project.price?.from ?? 0) < minPrice) {
      return false;
    }

    if (maxPrice && (project.price?.from ?? 0) > maxPrice) {
      return false;
    }

    return true;
  });
}

export function paginateProjects<T>(projects: T[], page: number, limit: number) {
  const safeLimit = Math.max(1, limit);
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit;

  return {
    pageItems: projects.slice(start, end),
    meta: {
      total: projects.length,
      page: safePage,
      pageSize: safeLimit,
    },
  };
}
