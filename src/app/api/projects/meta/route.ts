import { NextResponse } from 'next/server';
import { loadInventoryProjects } from '@/server/inventory';
import { SERVER_ENV } from '@/lib/server/env';

// Cache the response for 60 seconds to prevent redundant fetches during development.
export const revalidate = 60;

function buildMetadata(projects: any[]) {
  const developerSet = new Set<string>();
  const locationMap = new Map<string, Set<string>>();

  for (const project of projects) {
    if (project.developer) {
      developerSet.add(project.developer);
    }
    if (project.location?.city) {
      if (!locationMap.has(project.location.city)) {
        locationMap.set(project.location.city, new Set());
      }
      if (project.location.area) {
        locationMap.get(project.location.city)!.add(project.location.area);
      }
    }
  }

  const locations: Record<string, string[]> = {};
  for (const [city, areas] of locationMap.entries()) {
    locations[city] = Array.from(areas).sort();
  }

  return {
    developers: Array.from(developerSet).sort(),
    locations,
  };
}

export async function GET() {
  const headers: Record<string, string> = {
    'x-inventory-source': SERVER_ENV.USE_STATIC_INVENTORY !== 'false' ? 'static-env' : 'firestore',
  };

  const projects = await loadInventoryProjects();
  const meta = buildMetadata(projects);

  return NextResponse.json(meta, { headers });
}