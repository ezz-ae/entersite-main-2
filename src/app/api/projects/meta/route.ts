import { NextResponse } from 'next/server';
import { ENTRESTATE_INVENTORY } from '@/data/entrestate-inventory';
import { loadInventoryProjects } from '@/server/inventory';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { PUBLIC_ROLES } from '@/lib/server/roles';
import { SERVER_ENV } from '@/lib/server/env';

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

  const areasCount = Array.from(locationMap.values()).reduce((sum, areas) => sum + areas.size, 0);

  return {
    developers: Array.from(developerSet).sort(),
    locations,
    total: projects.length,
    citiesCount: locationMap.size,
    areasCount,
  };
}

export async function GET(req: Request) {
  let dataSource = 'static-fallback';
  let source: any[] = [];

  try {
    await requireRole(req, PUBLIC_ROLES);

    if (SERVER_ENV.USE_STATIC_INVENTORY !== 'false') {
      // 1. Static Mode (Default)
      source = ENTRESTATE_INVENTORY;
      dataSource = 'static-env';
    } else {
      try {
        // 2. Try Database
        source = await loadInventoryProjects(8000);
        dataSource = 'database';
      } catch (error) {
        // 3. Catch Error & 4. Fallback
        console.warn("[projects/meta] Database load failed, falling back to static.", error);
        source = ENTRESTATE_INVENTORY;
        dataSource = 'static-fallback';
      }
    }

    if (source.length) {
      return NextResponse.json(buildMetadata(source), {
        headers: { 'X-Inventory-Source': dataSource }
      });
    }
  } catch (error) {
    console.error('[projects/meta] failed to load metadata', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  return NextResponse.json(buildMetadata(ENTRESTATE_INVENTORY), {
    headers: { 'X-Inventory-Source': dataSource }
  });
}
