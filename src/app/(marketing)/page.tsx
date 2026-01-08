import { getAdminDb } from '@/server/firebase-admin';
import { ProjectData } from '@/lib/types';
import { HomeClient } from './home-client';
import { ENTRESTATE_INVENTORY } from '@/data/entrestate-inventory';

async function fetchInitialProjects(): Promise<ProjectData[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection('inventory_projects')
      .orderBy('name')
      .limit(6)
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ProjectData[];
  } catch (error) {
    console.error('[HomePage] Failed to fetch inventory_projects', error);
    // In case of an error, return fallback data
    return ENTRESTATE_INVENTORY.slice(0, 6);
  }
}

export default async function Page() {
  const initialProjects = await fetchInitialProjects();
  return <HomeClient initialProjects={initialProjects} />;
}
