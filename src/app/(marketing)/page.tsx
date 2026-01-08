import { ProjectData } from '@/lib/types';
import { HomeClient } from './home-client';
import { loadInventoryProjects } from '@/server/inventory';

export const dynamic = 'force-dynamic';

async function fetchInitialProjects(): Promise<ProjectData[]> {
  try {
    return await loadInventoryProjects(12);
  } catch (error) {
    console.error('[HomePage] Failed to fetch inventory_projects', error);
    return [];
  }
}

export default async function Page() {
  const initialProjects = await fetchInitialProjects();
  return <HomeClient initialProjects={initialProjects} />;
}
