import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  onSnapshot,
  where
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
  ownerUid: string;
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

export const createJob = async (ownerUid: string, type: Job['type'], params: any) => {
  let planSteps = ['init'];
  if (type === 'site_generation') {
    planSteps = ['renderBlocks', 'seoGenerate', 'adsGenerate', 'deploy'];
  } else if (type === 'ad_campaign') {
    planSteps = ['analyzeContent', 'generateKeywords', 'createHeadlines', 'budgetOptimization'];
  } else if (type === 'site_refiner') {
    planSteps = ['analyzeStructure', 'applyRefinements', 'finalReview'];
  }

  const jobData = {
    ownerUid,
    type,
    status: 'queued',
    plan: {
      flowId: `\${type}-flow`,
      steps: planSteps,
      params
    },
    steps: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, JOBS_COLLECTION), jobData);
  return { id: docRef.id, ...jobData };
};

export const getJobs = async (ownerUid: string) => {
  try {
    const q = query(
      collection(db, JOBS_COLLECTION),
      where('ownerUid', '==', ownerUid),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Job[];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

export const subscribeToJobs = (ownerUid: string, callback: (jobs: Job[]) => void) => {
  const q = query(
    collection(db, JOBS_COLLECTION),
    where('ownerUid', '==', ownerUid),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const jobs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Job[];
    callback(jobs);
  });
};

export const processJob = async (jobId: string) => {
  console.log(`Processing job \${jobId}...`);
  
  try {
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    
    await updateDoc(jobRef, { 
      status: 'running',
      updatedAt: serverTimestamp() 
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await updateDoc(jobRef, {
      steps: [{
        name: 'init',
        status: 'done',
        result: 'System initialized',
        timestamp: Date.now()
      }],
      updatedAt: serverTimestamp()
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    await updateDoc(jobRef, { 
      status: 'done', 
      updatedAt: serverTimestamp() 
    });

  } catch (error) {
    console.error("Error processing job:", error);
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    await updateDoc(jobRef, { status: 'error', updatedAt: serverTimestamp() });
  }
};
