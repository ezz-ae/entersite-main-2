import { NextRequest, NextResponse } from 'next/server';
import { filterProjects, paginateProjects } from '@/lib/projects/filter';
import { loadInventoryProjects } from '@/server/inventory';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';

const MAX_DATA_LOAD = 8000;

function parseFilters(searchParams: URLSearchParams) {
  const limitParam = parseInt(searchParams.get('limit') || '12', 10);
  const safeLimit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 12) : 12;
  const minPriceParam = parseFloat(searchParams.get('minPrice') || '');
  const maxPriceParam = parseFloat(searchParams.get('maxPrice') || '');

  return {
    query: searchParams.get('query')?.toLowerCase() ?? '',
    city: searchParams.get('city')?.toLowerCase() ?? 'all',
    status: searchParams.get('status')?.toLowerCase() ?? 'all',
    developer: searchParams.get('developer')?.toLowerCase() ?? '',
    minPrice: Number.isFinite(minPriceParam) ? minPriceParam : undefined,
    maxPrice: Number.isFinite(maxPriceParam) ? maxPriceParam : undefined,
    page: Math.max(parseInt(searchParams.get('page') || '1', 10), 1),
    limit: safeLimit,
  };
}

export async function GET(req: NextRequest) {
  // Public read-only inventory search; no auth or tenant writes allowed.
  const { searchParams } = new URL(req.url);
  const filters = parseFilters(searchParams);

  console.log("[projects/search] Incoming Request:", filters);

  try {
    const ip = getRequestIp(req);
    if (!(await enforceRateLimit(`projects:search:${ip}`, 120, 60_000))) {
      return NextResponse.json({ message: 'Rate limit exceeded' }, { status: 429 });
    }
    const source = await loadInventoryProjects(MAX_DATA_LOAD);
    
    if (!source.length) {
      console.warn("[projects/search] inventory_projects is empty.");
      return NextResponse.json({
        data: [],
        pagination: { total: 0, page: 1, limit: filters.limit, totalPages: 1 },
      });
    }

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
