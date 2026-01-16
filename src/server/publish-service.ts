import { getAdminDb } from '@/server/firebase-admin';
import type { SitePage } from '@/lib/types';
import type { DocumentSnapshot } from 'firebase-admin/firestore';

function normalizeTimestamp(value: any) {
  if (value?.toDate) {
    return value.toDate().toISOString();
  }
  return value;
}

function normalizeSite(doc: DocumentSnapshot) {
  const data = doc.data() || {};
  return {
    id: doc.id,
    ...data,
    createdAt: normalizeTimestamp(data.createdAt),
    updatedAt: normalizeTimestamp(data.updatedAt),
    lastPublishedAt: normalizeTimestamp(data.lastPublishedAt),
  } as SitePage;
}

export async function getPublishedSite(siteIdOrSlug: string): Promise<SitePage | null> {
  try {
    const db = getAdminDb();
    const direct = await db.collection('sites').doc(siteIdOrSlug).get();
    if (direct.exists && direct.data()?.published) {
      return normalizeSite(direct);
    }

    const bySubdomain = await db
      .collection('sites')
      .where('subdomain', '==', siteIdOrSlug)
      .limit(1)
      .get();
    if (!bySubdomain.empty) {
      const doc = bySubdomain.docs[0];
      if (doc.data()?.published) {
        return normalizeSite(doc);
      }
    }

    const byCustomDomain = await db
      .collection('sites')
      .where('customDomain', '==', siteIdOrSlug)
      .limit(1)
      .get();
    if (!byCustomDomain.empty) {
      const doc = byCustomDomain.docs[0];
      if (doc.data()?.published) {
        return normalizeSite(doc);
      }
    }

    return null;
  } catch (error) {
    console.error('[publish] Error fetching published site:', error);
    return null;
  }
}
