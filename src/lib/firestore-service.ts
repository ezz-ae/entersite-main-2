import {
  collection,
  doc,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/firebase';
import type { SitePage } from './types';
import { authorizedFetch } from '@/lib/auth-fetch';

// --- Types ---

// --- Site Operations ---

export const saveSite = async (site: SitePage) => {
  const response = await authorizedFetch('/api/sites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ site }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || 'Failed to save site');
  }
  const data = await response.json();
  return data.siteId as string;
};

export const updateSiteMetadata = async (siteId: string, data: Partial<SitePage>) => {
  if (!siteId) {
    throw new Error('Site ID is required to update metadata.');
  }
  const updates: Record<string, any> = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      updates[key] = value;
    }
  });
  if (Object.keys(updates).length === 0) {
    return;
  }
  updates.updatedAt = serverTimestamp();
  await setDoc(doc(db, 'sites', siteId), updates, { merge: true });
};

export const getUserSites = async () => {
  const response = await authorizedFetch('/api/sites', { cache: 'no-store' });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || 'Failed to load sites');
  }
  const data = await response.json();
  return (data.sites || []) as SitePage[];
};
