import { NextResponse } from 'next/server';
import { ENTRESTATE_INVENTORY } from '@/data/entrestate-inventory';
import { loadInventoryProjects } from '@/server/inventory';

function buildMetadata(projects: any[]) {
  const developerSet = new Set<string>();
  const locationMap = new Map<string, Set<string>>();

  projects.forEach((project) => {
    const developer = project.developer as string | undefined;
    const city = project.location?.city as string | undefined;
    const area = project.location?.area as string | undefined;

    if (developer) developerSet.add(developer);
    if (city) {
      if (!locationMap.has(city)) {
        locationMap.set(city, new Set());
      }
      if (area) {
        locationMap.get(city)!.add(area);
      }
    }
  });

  const locations = Array.from(locationMap.entries()).map(([city, areas]) => ({
    city,
    areas: Array.from(areas).sort(),
  })).sort((a, b) => a.city.localeCompare(b.city));

  return {
    developers: Array.from(developerSet).sort(),
    locations,
  };
}

export async function GET() {
  try {
    const projects = await loadInventoryProjects(8000);
    if (projects.length) {
      return NextResponse.json(buildMetadata(projects));
    }
  } catch (error) {
    console.error('[projects/meta] failed to load metadata', error);
  }

  return NextResponse.json(buildMetadata(ENTRESTATE_INVENTORY));
}
