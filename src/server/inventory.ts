import { getAdminDb } from '@/server/firebase-admin';
import { ENTRESTATE_INVENTORY } from '@/data/entrestate-inventory';
import { firebaseConfig } from '@/lib/firebase/config';
import type { ProjectData } from '@/lib/types';
import { SERVER_ENV } from '@/lib/server/env';

// Cache settings
const CACHE_TTL_MS = 5 * 60 * 1000;
const DEFAULT_MAX = 1000; // Reduced from 8000 to save Firestore quota during dev
const PUBLIC_PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  process.env.FIREBASE_PROJECT_ID ||
  process.env.project_id ||
  firebaseConfig.projectId;
const PUBLIC_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfig.apiKey;
const ADMIN_PROJECT_ID = (() => {
  if (process.env.FIREBASE_PROJECT_ID || process.env.project_id) {
    return process.env.FIREBASE_PROJECT_ID || process.env.project_id;
  }
  const adminConfig = process.env.FIREBASE_ADMIN_SDK_CONFIG;
  if (!adminConfig) return undefined;
  try {
    const parsed = JSON.parse(adminConfig) as { project_id?: string; projectId?: string };
    return parsed.project_id || parsed.projectId;
  } catch {
    return undefined;
  }
})();
const ADMIN_PROJECT_MISMATCH =
  ADMIN_PROJECT_ID && PUBLIC_PROJECT_ID && ADMIN_PROJECT_ID !== PUBLIC_PROJECT_ID;

let cachedProjects: ProjectData[] = [];
let cachedAt = 0;

type FirestoreValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
  timestampValue?: string;
  geoPointValue?: { latitude: number; longitude: number };
  mapValue?: { fields?: Record<string, FirestoreValue> };
  arrayValue?: { values?: FirestoreValue[] };
  referenceValue?: string;
};

const normalizeString = (value: unknown, fallback = '') => {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (typeof value === 'number') {
    return String(value);
  }
  return fallback;
};

const normalizeKey = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '');

const safeDecodeURIComponent = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const CITY_LABELS: Record<string, string> = {
  dubai: 'Dubai',
  abudhabi: 'Abu Dhabi',
  rasalkhaimah: 'Ras Al Khaimah',
  sharjah: 'Sharjah',
  ajman: 'Ajman',
  ummalquwain: 'Umm Al Quwain',
  fujairah: 'Fujairah',
  alain: 'Al Ain',
};

const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => (part.length > 2 ? part[0].toUpperCase() + part.slice(1) : part.toUpperCase()))
    .join(' ');

const normalizeCityLabel = (value: string, fallback: string) => {
  if (!value) return fallback;
  const key = normalizeKey(value);
  if (CITY_LABELS[key]) return CITY_LABELS[key];
  return toTitleCase(value.replace(/_/g, ' ')) || fallback;
};

const normalizeArray = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

function decodeFirestoreValue(value: FirestoreValue): any {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return Number(value.integerValue);
  if (value.doubleValue !== undefined) return Number(value.doubleValue);
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.timestampValue !== undefined) return value.timestampValue;
  if (value.geoPointValue !== undefined) return value.geoPointValue;
  if (value.nullValue !== undefined) return null;
  if (value.referenceValue !== undefined) return value.referenceValue;
  if (value.mapValue) {
    const fields = value.mapValue.fields || {};
    return decodeFirestoreFields(fields);
  }
  if (value.arrayValue) {
    return (value.arrayValue.values || []).map(decodeFirestoreValue);
  }
  return undefined;
}

function decodeFirestoreFields(fields: Record<string, FirestoreValue>) {
  const result: Record<string, any> = {};
  Object.entries(fields).forEach(([key, value]) => {
    result[key] = decodeFirestoreValue(value);
  });
  return result;
}

function normalizeProjectData(raw: any, id: string): ProjectData {
  const locationRaw = raw.location || {};
  const cityRaw = normalizeString(locationRaw.city || raw.city || raw.market, 'UAE');
  const city = normalizeCityLabel(cityRaw, 'UAE');
  const area = normalizeString(locationRaw.area || raw.area || raw.community, city);
  const mapQuery = normalizeString(
    locationRaw.mapQuery || raw.mapQuery,
    area ? `${area}, ${city}` : city
  );

  const descriptionRaw = raw.description || raw.details || raw.summary || raw.about;
  let descriptionFull = '';
  let descriptionShort = '';
  if (typeof descriptionRaw === 'string') {
    descriptionFull = descriptionRaw;
    descriptionShort = descriptionRaw;
  } else if (descriptionRaw && typeof descriptionRaw === 'object') {
    descriptionFull = normalizeString(
      descriptionRaw.full || descriptionRaw.long || descriptionRaw.text,
      ''
    );
    descriptionShort = normalizeString(
      descriptionRaw.short || descriptionRaw.summary || descriptionRaw.brief,
      descriptionFull
    );
  }

  const priceFrom = normalizeNumber(
    raw.price?.from ?? raw.priceFrom ?? raw.startingPrice ?? raw.minPrice ?? raw.price_min
  );
  const priceLabel =
    normalizeString(raw.price?.label || raw.priceLabel || raw.priceText) ||
    (priceFrom ? `AED ${priceFrom.toLocaleString('en-AE')}` : 'Price on request');

  const performanceRaw = raw.performance || {};
  const trendRaw = normalizeString(
    performanceRaw.marketTrend || raw.marketTrend || performanceRaw.market_trend,
    'stable'
  ).toLowerCase();
  const marketTrend =
    trendRaw === 'up' || trendRaw === 'down' || trendRaw === 'stable'
      ? (trendRaw as 'up' | 'down' | 'stable')
      : 'stable';

  const handoverRaw = raw.handover || raw.handoverDate || raw.delivery?.handover;
  let handover: ProjectData['handover'] = null;
  if (handoverRaw && typeof handoverRaw === 'object') {
    const quarter = normalizeNumber(handoverRaw.quarter || handoverRaw.q);
    const year = normalizeNumber(handoverRaw.year || handoverRaw.y);
    if (quarter && year) {
      handover = { quarter, year };
    }
  }
  if (!handover && raw.deliveryYear) {
    const year = normalizeNumber(raw.deliveryYear);
    if (year) {
      handover = { quarter: 4, year };
    }
  }

  const images = [
    ...normalizeArray(raw.images),
    ...normalizeArray(raw.gallery),
  ];
  if (!images.length) {
    const hero = normalizeString(raw.image || raw.heroImage || raw.coverImage);
    if (hero) images.push(hero);
  }

  const bedroomsRaw = raw.bedrooms || {};
  const bedroomMin = normalizeNumber(bedroomsRaw.min || raw.bedroomMin);
  const bedroomMax = normalizeNumber(bedroomsRaw.max || raw.bedroomMax);
  const bedrooms =
    bedroomMin || bedroomMax
      ? {
          min: bedroomMin || bedroomMax,
          max: bedroomMax || bedroomMin,
          label: normalizeString(
            bedroomsRaw.label,
            bedroomMin && bedroomMax ? `${bedroomMin}-${bedroomMax}` : `${bedroomMin || bedroomMax}`
          ),
        }
      : undefined;

  const areaRaw = raw.areaSqft || {};
  const areaMin = normalizeNumber(areaRaw.min || raw.areaMin);
  const areaMax = normalizeNumber(areaRaw.max || raw.areaMax);
  const areaSqft =
    areaMin || areaMax
      ? {
          min: areaMin || areaMax,
          max: areaMax || areaMin,
          label: normalizeString(
            areaRaw.label,
            areaMin && areaMax ? `${areaMin}-${areaMax} sqft` : `${areaMin || areaMax} sqft`
          ),
        }
      : undefined;

  const descriptionFallback = descriptionFull || descriptionShort || 'Details coming soon.';

  return {
    id,
    name: normalizeString(raw.name || raw.title, 'Untitled Project'),
    developer: normalizeString(raw.developer || raw.builder, 'Unknown Developer'),
    location: {
      city,
      area,
      mapQuery,
    },
    handover,
    deliveryYear: normalizeNumber(raw.deliveryYear) || undefined,
    status: normalizeString(raw.status || raw.availabilityStatus),
    description: {
      full: descriptionFull || descriptionFallback,
      short: descriptionShort || descriptionFallback,
    },
    features: normalizeArray(raw.features || raw.amenities),
    price: {
      from: priceFrom || 0,
      label: priceLabel,
      sqftAvg: normalizeNumber(raw.price?.sqftAvg || raw.sqftAvg) || undefined,
    },
    performance: {
      roi: normalizeNumber(performanceRaw.roi || raw.roi),
      capitalAppreciation: normalizeNumber(
        performanceRaw.capitalAppreciation || performanceRaw.capital_appreciation || raw.capitalAppreciation
      ),
      rentalYield: normalizeNumber(performanceRaw.rentalYield || raw.rentalYield),
      marketTrend,
      priceHistory: Array.isArray(performanceRaw.priceHistory)
        ? performanceRaw.priceHistory
        : [],
    },
    availability: normalizeString(raw.availability || raw.status, 'Available') as ProjectData['availability'],
    images,
    bedrooms,
    areaSqft,
    tags: normalizeArray(raw.tags),
    publicUrl: normalizeString(raw.publicUrl || raw.url),
    unitsStockUpdatedAt: normalizeString(raw.unitsStockUpdatedAt),
    brochureUrl: normalizeString(raw.brochureUrl),
  };
}

async function loadPublicInventory(max: number): Promise<ProjectData[]> {
  if (!PUBLIC_PROJECT_ID || !PUBLIC_API_KEY) {
    return [];
  }

  const projects: ProjectData[] = [];
  const baseUrl = `https://firestore.googleapis.com/v1/projects/${PUBLIC_PROJECT_ID}/databases/(default)/documents/inventory_projects`;
  let pageToken: string | undefined;

  while (projects.length < max) {
    const url = new URL(baseUrl);
    url.searchParams.set('pageSize', String(Math.min(1000, max - projects.length)));
    url.searchParams.set('key', PUBLIC_API_KEY);
    if (pageToken) {
      url.searchParams.set('pageToken', pageToken);
    }

    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) {
      break;
    }

    const data = await res.json();
    const docs = Array.isArray(data.documents) ? data.documents : [];
    docs.forEach((doc: any) => {
      const name = typeof doc.name === 'string' ? doc.name : '';
      const id = name.split('/').pop() || '';
      const raw = decodeFirestoreFields(doc.fields || {});
      projects.push(normalizeProjectData(raw, id));
    });

    pageToken = data.nextPageToken;
    if (!pageToken) {
      break;
    }
  }

  return projects;
}

async function loadPublicProjectById(projectId: string): Promise<ProjectData | null> {
  if (!PUBLIC_PROJECT_ID || !PUBLIC_API_KEY || !projectId) {
    return null;
  }

  const url = new URL(
    `https://firestore.googleapis.com/v1/projects/${PUBLIC_PROJECT_ID}/databases/(default)/documents/inventory_projects/${encodeURIComponent(projectId)}`
  );
  url.searchParams.set('key', PUBLIC_API_KEY);

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  if (!data?.fields) {
    return null;
  }

  const raw = decodeFirestoreFields(data.fields);
  return normalizeProjectData(raw, projectId);
}

export async function loadInventoryProjects(max = DEFAULT_MAX, forceRefresh = false) {
  if (SERVER_ENV.USE_STATIC_INVENTORY !== 'false') {
    // Static mode (default) - prevents quota usage unless explicitly disabled
    return ENTRESTATE_INVENTORY.slice(0, max).map((project) => normalizeProjectData(project, project.id));
  }

  const now = Date.now();
  if (!forceRefresh && cachedProjects.length && now - cachedAt < CACHE_TTL_MS) {
    return cachedProjects.slice(0, max);
  }

  let projects: ProjectData[] = [];

  if (ADMIN_PROJECT_MISMATCH) {
    console.warn(
      `[inventory] Admin project (${ADMIN_PROJECT_ID}) differs from public project (${PUBLIC_PROJECT_ID}). Using admin source first.`
    );
  }

  try {
    const db = getAdminDb();
    const snapshot = await db.collection('inventory_projects').limit(max).get();
    if (!snapshot.empty) {
      projects = snapshot.docs.map((doc) => normalizeProjectData(doc.data(), doc.id));
    }
  } catch (error) {
    console.error('[inventory] admin load failed', error);
  }

  if (!projects.length) {
    try {
      projects = await loadPublicInventory(max);
    } catch (error) {
      console.error('[inventory] public load failed', error);
    }
  }

  if (!projects.length) {
    projects = ENTRESTATE_INVENTORY.map((project) => normalizeProjectData(project, project.id));
  }

  cachedProjects = projects;
  cachedAt = now;
  return projects.slice(0, max);
}

export async function loadInventoryProjectById(projectId: string) {
  if (!projectId) return null;
  const resolvedId = safeDecodeURIComponent(projectId);

  if (SERVER_ENV.USE_STATIC_INVENTORY === 'false') {
    try {
      const db = getAdminDb();
      const snapshot = await db.collection('inventory_projects').doc(resolvedId).get();
      if (snapshot.exists) {
        return normalizeProjectData(snapshot.data(), snapshot.id);
      }
    } catch (error) {
      console.error('[inventory] admin project lookup failed', error);
    }

    try {
      const project = await loadPublicProjectById(resolvedId);
      if (project) return project;
    } catch (error) {
      console.error('[inventory] public project lookup failed', error);
    }
  }

  // Fallback: Use cached or static data.
  // We avoid calling loadInventoryProjects() in DB mode to prevent triggering a full 8k read
  // just for a single ID lookup miss.
  console.log(`[inventory] Safe fallback triggered for ID: ${projectId} - Skipping full DB load.`);
  let fallback = cachedProjects;
  const now = Date.now();
  const isCacheValid = cachedProjects.length && now - cachedAt < CACHE_TTL_MS;

  if (!isCacheValid || SERVER_ENV.USE_STATIC_INVENTORY !== 'false') {
    fallback = ENTRESTATE_INVENTORY.map((p) => normalizeProjectData(p, p.id));
  }

  const directMatch = fallback.find((project) => project.id === resolvedId);
  if (directMatch) return directMatch;

  const normalizedId = normalizeKey(resolvedId);
  if (!normalizedId) return null;

  return (
    fallback.find((project) => {
      if (normalizeKey(project.id) === normalizedId) return true;
      if (normalizeKey(project.name) === normalizedId) return true;
      if (project.publicUrl) {
        const slug = project.publicUrl.split('/').filter(Boolean).pop();
        if (slug && normalizeKey(slug) === normalizedId) return true;
      }
      return false;
    }) ?? null
  );
}

export async function getRelevantProjects(message: string, context?: string, max = 8) {
  const projects = await loadInventoryProjects();
  const query = `${message || ''} ${context || ''}`.toLowerCase();
  const terms = query.split(/[^a-z0-9]+/i).filter((term) => term.length > 2);

  if (!terms.length) {
    return [];
  }

  const scored = projects
    .map((project) => {
      const haystack = [
        project.name,
        project.developer,
        project.location?.city,
        project.location?.area,
        project.description?.short,
        project.tags?.join(' '),
        project.features?.join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      let score = 0;
      terms.forEach((term) => {
        if (haystack.includes(term)) {
          score += term.length > 4 ? 2 : 1;
        }
      });
      return { project, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((item) => item.project);

  return scored.length ? scored : projects.slice(0, max);
}

export function formatProjectContext(project: ProjectData) {
  const location = project.location?.area || project.location?.city || 'UAE';
  const price = project.price?.label || 'Price on request';
  const handover = project.handover ? `Q${project.handover.quarter} ${project.handover.year}` : 'TBD';
  const status = project.availability || project.status || 'Available';
  const highlights = project.features?.slice(0, 3).join(', ');

  return `- ${project.name} (${location}) | ${price} | ${status} | Handover ${handover}${highlights ? ` | ${highlights}` : ''}`;
}
