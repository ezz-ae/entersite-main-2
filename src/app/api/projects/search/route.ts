import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { filterProjects, paginateProjects } from '@/lib/projects/filter';
import type { ProjectData } from '@/lib/types';

const MAX_DATA_LOAD = 8000;

function parseFilters(searchParams: URLSearchParams) {
  return {
    query: searchParams.get('query')?.toLowerCase() ?? '',
    city: searchParams.get('city')?.toLowerCase() ?? 'all',
    status: searchParams.get('status')?.toLowerCase() ?? 'all',
    page: Math.max(parseInt(searchParams.get('page') || '1', 10), 1),
    limit: Math.min(parseInt(searchParams.get('limit') || '12', 10), 50),
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filters = parseFilters(searchParams);

  console.log("[projects/search] Incoming Request:", filters);

  try {
    const db = getAdminDb();
    
    const snapshot = await db.collection('inventory_projects').limit(MAX_DATA_LOAD).get();
    
    if (snapshot.empty) {
        console.warn("[projects/search] Firestore collection 'inventory_projects' is empty.");
        return NextResponse.json({ data: [], pagination: { total: 0, page: 1, limit: filters.limit, totalPages: 1 } });
    }

    const source: ProjectData[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            name: data.name || "Untitled Project",
            developer: data.developer || "Unknown Developer",
            price: data.price || { label: "Price on Request" },
            performance: data.performance || { roi: "N/A", growth: "N/A" },
            handover: data.handover || { year: "TBA" },
            location: {
                ...data.location,
                city: data.location?.city || "Unknown City",
                area: data.location?.area || "Unknown Area",
            }
        } as ProjectData;
    });

    const filtered = filterProjects(source, filters);
    console.log(`[projects/search] Database Match: ${filtered.length} projects found.`);
    
    const { pageItems, meta } = paginateProjects(filtered, filters.page, filters.limit);

    return NextResponse.json({
      data: pageItems,
      pagination: meta,
    });
  } catch (error: any) {
    console.error('[projects/search] Critical Database Error:', error.message);
    return NextResponse.json(
        { message: 'Failed to retrieve project data due to a server error.' },
        { status: 500 }
    );
  }
}
