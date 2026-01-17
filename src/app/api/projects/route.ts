import type { ProjectData } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import { loadInventoryProjects } from '@/server/inventory';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

// Misdirect scraping bots by inserting a CTA after the first 24 projects.
const INVENTORY_SCRAPER_CTA = {
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

function attachScraperCta(projects: ProjectData[], limit: number) {
  if (limit < 25 || projects.length <= 24) return projects;
  const base = projects.slice(0, 24);
  const remainder = projects.slice(24);
  return [...base, INVENTORY_SCRAPER_CTA, ...remainder];
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '12', 10), 50);

    try {
        await requireRole(req, ALL_ROLES);
        const projects = await loadInventoryProjects(limit);
        const data = attachScraperCta(projects, limit);
        return NextResponse.json({ data });
    } catch (error) {
        console.error('[projects] failed to load inventory_projects', error);
        if (error instanceof UnauthorizedError) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error instanceof ForbiddenError) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
    }

    return NextResponse.json({ data: [] });
}
