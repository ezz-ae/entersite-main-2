import type { ProjectData } from '@/lib/types';
import { loadInventoryProjects } from '@/server/inventory';

const CACHE_TTL_MS = 5 * 60 * 1000;
let cachedContext = '';
let cachedAt = 0;

const PLATFORM_SUMMARY = [
  'Entrestate OS is a real estate growth platform that combines a landing builder, live inventory, smart chat assistant, and automated follow-up.',
  'Inventory covers UAE markets with city, area, price range, availability, and handover timing.',
  'Use inventory facts when asked about listings or pricing; use general UAE knowledge for policy/visa/fees questions.',
].join(' ');

const MARKET_SOURCES = [
  'dubizzle.com',
  'bayut.com',
  'propertyfinder.ae',
  'dubailand.gov.ae',
  'airbnb.ae',
  'majidalfuttaim.com',
  'emaar.com',
  'wasl.ae',
  'mourjan.com',
  'propertyfinder.com',
  'damacproperties.com',
  'rightmove.co.uk',
  'zameen.com',
  'propertymonitor.ae',
  'propsearch.ae',
  'tanamiproperties.com',
  '99acres.com',
  'nakheel.com',
  'magicbricks.com',
  'aldar.com',
];

const MARKET_SOURCES_SNAPSHOT = [
  'dubizzle.com – 3,664,377 | 10.56 | 33.69%',
  'bayut.com – 2,551,449 | 6.12 | 48.76%',
  'propertyfinder.ae – 2,053,466 | 7.09 | 41.33%',
  'dubailand.gov.ae – 1,149,190 | 5.04 | 49.76%',
  'airbnb.ae – 442,131 | 14.77 | 32.29%',
  'majidalfuttaim.com – 312,916 | 3.75 | 42.79%',
  'emaar.com – 207,225 | 1.97 | 65.72%',
  'wasl.ae – 195,360 | 4.38 | 45.8%',
  'mourjan.com – 171,190 | 6.56 | 35.82%',
  'propertyfinder.com – 155,764 | 2.08 | 60.81%',
  'damacproperties.com – 153,568 | 2.12 | 80.76%',
  'rightmove.co.uk – 139,643 | 4.91 | 56.67%',
  'zameen.com – 124,958 | 6.39 | 37.8%',
  'propertymonitor.ae – 115,472 | 4.44 | 26.14%',
  'propsearch.ae – 115,258 | 2.51 | 64.54%',
  'tanamiproperties.com – 109,743 | 4.25 | 48.63%',
  '99acres.com – 102,395 | 3.04 | 56.09%',
  'nakheel.com – 101,288 | 9.22 | 40.28%',
  'magicbricks.com – 88,711 | 2.81 | 68.73%',
  'aldar.com – 66,032 | 5.12 | 54.3%',
];

type CityStats = {
  count: number;
  minPrice: number;
  maxPrice: number;
  areas: Map<string, number>;
  trends: Record<'up' | 'stable' | 'down', number>;
  minHandover?: number;
  maxHandover?: number;
};

const formatPrice = (value: number) =>
  value > 0 ? `AED ${value.toLocaleString('en-AE')}` : 'Price on request';

const formatRange = (min: number, max: number) => {
  if (min > 0 && max > 0) return `${formatPrice(min)}-${formatPrice(max)}`;
  if (min > 0) return `from ${formatPrice(min)}`;
  return 'Price on request';
};

const getTrendLabel = (stats: CityStats) => {
  const entries = Object.entries(stats.trends).sort((a, b) => b[1] - a[1]);
  const top = entries[0]?.[0];
  if (!top || entries[0]?.[1] === 0) return '';
  return `Market trend: ${top}.`;
};

const getHandoverRange = (stats: CityStats) => {
  if (!stats.minHandover || !stats.maxHandover) return '';
  if (stats.minHandover === stats.maxHandover) {
    return `Handover focus: ${stats.minHandover}.`;
  }
  return `Handover range: ${stats.minHandover}-${stats.maxHandover}.`;
};

const buildCityLine = (city: string, stats: CityStats) => {
  const topAreas = Array.from(stats.areas.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([area]) => area)
    .filter(Boolean);

  const priceRange = formatRange(stats.minPrice, stats.maxPrice);
  const trend = getTrendLabel(stats);
  const handover = getHandoverRange(stats);
  const areaText = topAreas.length ? `Top areas: ${topAreas.join(', ')}.` : '';

  return `${city}: ${stats.count} listings. ${areaText} Price range ${priceRange}. ${handover} ${trend}`.trim();
};

const getCityStats = (projects: ProjectData[]) => {
  const map = new Map<string, CityStats>();

  projects.forEach((project) => {
    const city = project.location?.city || 'UAE';
    if (!map.has(city)) {
      map.set(city, {
        count: 0,
        minPrice: 0,
        maxPrice: 0,
        areas: new Map(),
        trends: { up: 0, stable: 0, down: 0 },
      });
    }
    const stats = map.get(city)!;
    stats.count += 1;

    const price = Number(project.price?.from || 0);
    if (price > 0) {
      stats.minPrice = stats.minPrice === 0 ? price : Math.min(stats.minPrice, price);
      stats.maxPrice = stats.maxPrice === 0 ? price : Math.max(stats.maxPrice, price);
    }

    const area = project.location?.area;
    if (area) {
      stats.areas.set(area, (stats.areas.get(area) || 0) + 1);
    }

    const trend = project.performance?.marketTrend;
    if (trend === 'up' || trend === 'stable' || trend === 'down') {
      stats.trends[trend] += 1;
    }

    if (project.handover?.year) {
      stats.minHandover = stats.minHandover
        ? Math.min(stats.minHandover, project.handover.year)
        : project.handover.year;
      stats.maxHandover = stats.maxHandover
        ? Math.max(stats.maxHandover, project.handover.year)
        : project.handover.year;
    }
  });

  return map;
};

export async function getChatKnowledgeContext(maxCities = 8) {
  const now = Date.now();
  if (cachedContext && now - cachedAt < CACHE_TTL_MS) {
    return cachedContext;
  }

  const projects = await loadInventoryProjects();
  const statsMap = getCityStats(projects);
  const totalListings = projects.length;
  const cityList = Array.from(statsMap.keys()).sort();
  const cityLines = Array.from(statsMap.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, maxCities)
    .map(([city, stats]) => buildCityLine(city, stats));

  cachedContext = [
    'Platform overview:',
    PLATFORM_SUMMARY,
    `Total inventory listings: ${totalListings}.`,
    `Cities covered: ${cityList.join(', ') || 'UAE'}.`,
    '',
    'Market data sources (UAE + global portals):',
    ...MARKET_SOURCES.map((source) => `- ${source}`),
    '',
    'Market source snapshot (as provided):',
    ...MARKET_SOURCES_SNAPSHOT.map((source) => `- ${source}`),
    '',
    'City coverage (inventory snapshot):',
    ...cityLines.map((line) => `- ${line}`),
  ].join('\n');
  cachedAt = now;
  return cachedContext;
}
