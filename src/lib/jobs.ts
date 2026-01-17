import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/firebase';

export interface JobStep {
  name: string;
  status: 'pending' | 'running' | 'done' | 'error';
  result?: string;
  error?: string;
  timestamp: number;
}

export interface Job {
  id: string;
  tenantId: string;
  type: 'site_generation' | 'ad_campaign' | 'seo_audit' | 'site_refiner';
  status: 'queued' | 'running' | 'done' | 'error';
  plan: {
    flowId: string;
    steps: string[];
    params: Record<string, any>;
  };
  steps: JobStep[];
  result?: Record<string, any>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const JOBS_COLLECTION = 'jobs';

const getPlanSteps = (type: Job['type']) => {
  if (type === 'site_generation') {
    return ['renderBlocks', 'seoGenerate', 'adsGenerate', 'deploy'];
  }
  if (type === 'ad_campaign') {
    return ['analyzeContent', 'generateKeywords', 'createHeadlines', 'budgetOptimization'];
  }
  if (type === 'site_refiner') {
    return ['analyzeStructure', 'applyRefinements', 'finalReview'];
  }
  return ['init'];
};

export const createJob = async (
  tenantId: string,
  type: Job['type'],
  params: any,
) => {
  const planSteps = getPlanSteps(type);
  const jobData = {
    tenantId,
    type,
    status: 'queued',
    plan: {
      flowId: `${type}-flow`,
      steps: planSteps,
      params,
    },
    steps: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, JOBS_COLLECTION), jobData);
  return { id: docRef.id, ...jobData };
};

export const getJobs = async (tenantId: string) => {
  try {
    const q = query(
      collection(db, JOBS_COLLECTION),
      where('tenantId', '==', tenantId),
      orderBy('createdAt', 'desc'),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Job[];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

export const subscribeToJobs = (tenantId: string, callback: (jobs: Job[]) => void) => {
  const q = query(
    collection(db, JOBS_COLLECTION),
    where('tenantId', '==', tenantId),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, (snapshot) => {
    const jobs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Job[];
    callback(jobs);
  });
};

export const processJob = async (jobId: string) => {
  console.log(`Processing job ${jobId}...`);

  try {
    const jobRef = doc(db, JOBS_COLLECTION, jobId);

    await updateDoc(jobRef, {
      status: 'running',
      updatedAt: serverTimestamp(),
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await updateDoc(jobRef, {
      steps: [
        {
          name: 'init',
          status: 'done',
          result: 'System initialized',
          timestamp: Date.now(),
        },
      ],
      updatedAt: serverTimestamp(),
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await updateDoc(jobRef, {
      status: 'done',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error processing job:', error);
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    await updateDoc(jobRef, { status: 'error', updatedAt: serverTimestamp() });
  }
};
