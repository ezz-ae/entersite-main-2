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

export interface Job {
  id?: string;
  ownerUid: string;
  type: 'site_build' | 'ad_campaign' | 'seo_audit' | 'listing_sync';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  data: any;
  result?: any;
  createdAt: any;
  updatedAt: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: 'developer' | 'agent' | 'admin';
  credits: number;
}

// --- Site Operations ---

export const saveSite = async (ownerUid: string, site: SitePage) => {
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

export const getUserSites = async (ownerUid: string) => {
  const q = query(collection(db, 'sites'), where('ownerUid', '==', ownerUid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data() as SitePage);
};

// --- Job System (The Engine) ---

/**
 * Creates a job that your Python/Cloud Run workers will pick up.
 * This is the "Fire and Forget" trigger for AI agents.
 */
export const createJob = async (ownerUid: string, type: Job['type'], data: any) => {
  const jobData = {
    ownerUid,
    type,
    status: 'queued',
    data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  const docRef = await addDoc(collection(db, 'jobs'), jobData);
  return docRef.id;
};

/**
 * Real-time listener for job status updates.
 * Use this in the UI to show progress bars / "AI Thinking" states.
 */
export const subscribeToJob = (jobId: string, callback: (job: Job) => void) => {
  return onSnapshot(doc(db, 'jobs', jobId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as Job);
    }
  });
};
