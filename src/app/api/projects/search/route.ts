import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { filterProjects, paginateProjects } from '@/lib/projects/filter';
import type { ProjectData } from '@/lib/types';

const MAX_DATA_LOAD = 8000;

function parseFilters(searchParams: URLSearchParams) {
  const limitParam = parseInt(searchParams.get('limit') || '12', 10);
  const safeLimit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 12) : 12;

  return {
    query: searchParams.get('query')?.toLowerCase() ?? '',
    city: searchParams.get('city')?.toLowerCase() ?? 'all',
    status: searchParams.get('status')?.toLowerCase() ?? 'all',
    page: Math.max(parseInt(searchParams.get('page') || '1', 10), 1),
    limit: safeLimit,
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
        const performance = {
            roi: data.performance?.roi ?? 0,
            capitalAppreciation: data.performance?.capitalAppreciation ?? 0,
            rentalYield: data.performance?.rentalYield ?? 0,
            marketTrend: data.performance?.marketTrend ?? 'stable',
            priceHistory: Array.isArray(data.performance?.priceHistory) ? data.performance.priceHistory : [],
        };

        return {
            id: doc.id,
            ...data,
            name: data.name || "Untitled Project",
            developer: data.developer || "Unknown Developer",
            availability: data.availability || data.status || "Available",
            price: {
                ...data.price,
                label: data.price?.label || "Price on request",
                from: data.price?.from ?? 0,
            },
            performance,
            handover: data.handover ?? null,
            location: {
                ...data.location,
                city: data.location?.city || "Unknown City",
                area: data.location?.area || "Unknown Area",
                mapQuery: data.location?.mapQuery || "",
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
        { message: 'Could not load projects right now. Please try again.' },
        { status: 500 }
    );
  }
}
