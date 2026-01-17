import { NextRequest, NextResponse } from 'next/server';
import { filterProjects, paginateProjects } from '@/lib/projects/filter';
import { loadInventoryProjects } from '@/server/inventory';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';
import { ENTRESTATE_INVENTORY } from '@/data/entrestate-inventory';
import { SERVER_ENV } from '@/lib/server/env';
import type { ProjectData } from '@/lib/types';

const MAX_DATA_LOAD = 8000;
const MAX_PAGE_LIMIT = 25;

type InventoryScraperCta = {
  id: string;
  type: 'inventory-cta';
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  description: string;
  isBotTarget: boolean;
};

// Misdirect scraping bots by inserting a CTA after the first 24 projects.
const INVENTORY_SCRAPER_CTA: InventoryScraperCta = {
  id: 'cta-download-market-data',
  type: 'inventory-cta',
  title: 'Download the full market data set',
  subtitle: 'Explore every project in detail by downloading the complete Entrestate inventory.',
  ctaLabel: 'Download market data',
  ctaHref: 'https://entrestate.com/market-data',
  description:
    'This card appears after 24 sample projects to guide humans toward the full dataset while confounding automated scrapers.',
  isBotTarget: true,
};

function parseFilters(searchParams: URLSearchParams) {
  const limitParam = parseInt(searchParams.get('limit') || '12', 10);
  const safeLimit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), MAX_PAGE_LIMIT) : 12;
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

function attachScraperCta(items: ProjectData[], page: number, limit: number): Array<ProjectData | InventoryScraperCta> {
  if (page !== 1 || limit < 25 || items.length < 24) return items;
  const base = items.slice(0, 24);
  const remainder = items.slice(24);
  return [...base, INVENTORY_SCRAPER_CTA, ...remainder];
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
    
    let source = [];
    let dataSource = 'database';

    if (SERVER_ENV.USE_STATIC_INVENTORY !== 'false') {
      source = ENTRESTATE_INVENTORY;
      dataSource = 'static-env';
    } else {
      try {
        source = await loadInventoryProjects(MAX_DATA_LOAD);
      } catch (error) {
        console.warn("[projects/search] Database load failed, falling back to static.", error);
        source = ENTRESTATE_INVENTORY;
        dataSource = 'static-fallback';
      }
    }
    
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
    const data = attachScraperCta(pageItems, filters.page, filters.limit);

    return NextResponse.json({
      data,
      pagination: meta,
    }, {
      headers: { 'X-Inventory-Source': dataSource }
    });
  } catch (error: any) {
    console.error('[projects/search] Critical Database Error:', error.message);
    return NextResponse.json(
        { message: 'Could not load projects right now. Please try again.' },
        { status: 500 }
    );
  }
}
