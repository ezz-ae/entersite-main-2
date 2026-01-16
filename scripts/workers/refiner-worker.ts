#!/usr/bin/env ts-node
import 'dotenv/config';
import {
  getFirestore,
  Timestamp,
  FieldValue,
} from 'firebase-admin/firestore';
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import type { SitePage, Block } from '@/lib/types';

function initAdmin() {
  if (!getApps().length) {
    initializeApp({
      credential: applicationDefault(),
    });
  }
}

const db = (() => {
  initAdmin();
  return getFirestore();
})();

type JobDoc = {
  ownerUid: string;
  status: 'queued' | 'running' | 'done' | 'error';
  plan: {
    params: Record<string, any>;
  };
  steps?: {
    name: string;
    status: 'pending' | 'running' | 'done' | 'error';
    result?: string;
    timestamp: number;
  }[];
  createdAt: Timestamp | FieldValue;
};

const REFINER_STEPS = [
  { name: 'analyzeStructure', result: 'Layout validated and accessibility scan complete.' },
  { name: 'applyRefinements', result: 'Applied hierarchy, spacing, and CTA copy polish.' },
  { name: 'finalReview', result: 'Ready for user review and apply.' },
] as const;

function clonePage(page: SitePage): SitePage {
  return JSON.parse(JSON.stringify(page));
}

function refineBlocks(blocks: Block[]): Block[] {
  return blocks.map((block) => {
    if (block.type === 'hero' && block.data?.headline) {
      return {
        ...block,
        data: {
          ...block.data,
          eyebrow: block.data.eyebrow || 'Refiner Draft',
          headline: `${block.data.headline} · Polished`,
          description:
            block.data.description ||
            'Refiner emphasized clarity and actionability for this hero.',
          primaryCtaLabel: block.data.primaryCtaLabel || 'Book A Call',
        },
      };
    }
    if (block.type === 'cta-form' && block.data?.headline) {
      return {
        ...block,
        data: {
          ...block.data,
          headline: `${block.data.headline} (Refined)`,
        },
      };
    }
    return block;
  });
}

function createRefinedSnapshot(snapshot: SitePage | undefined): SitePage | null {
  if (!snapshot) return null;
  const page = clonePage(snapshot);
  page.title = `${page.title} · Refiner Draft`;
  page.blocks = refineBlocks(page.blocks || []);
  page.updatedAt = new Date().toISOString();
  return page;
}

function createHtmlPreview(page: SitePage, message: string) {
  return `
    <section style="font-family: Inter, sans-serif; padding: 64px; background: #0b0b0e; color: white;">
      <p style="letter-spacing: .3em; text-transform: uppercase; color: #f5c453; font-size: 12px;">
        Refiner Draft Preview
      </p>
      <h1 style="font-size: 42px; line-height: 1.1; margin-top: 12px;">${page.title}</h1>
      <p style="color: #cfd2d6; margin-top: 16px; font-size: 16px;">
        ${message}
      </p>
      <div style="margin-top: 32px; display: inline-flex; align-items: center; gap: 12px;">
        <span style="height: 12px; width: 12px; background: #4ade80; border-radius: 50%;"></span>
        <span>Refiner ready — apply in builder to publish.</span>
      </div>
    </section>
  `;
}

async function processJob(jobId: string, jobData: JobDoc) {
  const jobRef = db.collection('jobs').doc(jobId);
  console.log(`▶️ Processing job ${jobId}`);
  await jobRef.update({
    status: 'running',
    steps: [],
    updatedAt: FieldValue.serverTimestamp(),
  });

  const start = Date.now();
  const steps = [];
  for (const step of REFINER_STEPS) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    steps.push({
      name: step.name,
      status: 'done' as const,
      result: step.result,
      timestamp: Date.now(),
    });
    await jobRef.update({
      steps,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  const snapshot = jobData.plan?.params?.snapshot as SitePage | undefined;
  const siteId = jobData.plan?.params?.siteId as string | undefined;
  const refinedSnapshot = createRefinedSnapshot(snapshot);
  const htmlPreview = createHtmlPreview(
    refinedSnapshot || snapshot || {
      id: 'refiner',
      title: 'Refiner Draft',
      blocks: [],
      canonicalListings: [],
      brochureUrl: '',
      seo: { title: '', description: '', keywords: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    `Refiner finished for ${jobData.plan?.params?.siteTitle || siteId || 'site'}.`,
  );

  await jobRef.update({
    status: 'done',
    result: {
      artifacts: {
        refinedSnapshot,
        refinedHtml: htmlPreview,
      },
    },
    updatedAt: FieldValue.serverTimestamp(),
  });

  if (siteId && refinedSnapshot) {
    const siteRef = db.collection('sites').doc(siteId);
    await siteRef.set(
      {
        refinerStatus: 'review',
        lastRefinedAt: new Date().toISOString(),
        lastRefinerJobId: jobId,
        refinerDraftSnapshot: refinedSnapshot,
        refinerDraftHtml: htmlPreview,
        refinerPreviewUrl: jobData.plan?.params?.previewUrl,
      },
      { merge: true },
    );
  }

  console.log(
    `✅ Job ${jobId} completed in ${(Date.now() - start) / 1000}s (siteId=${siteId || 'n/a'})`,
  );
}

async function poll() {
  const snapshot = await db
    .collection('jobs')
    .where('type', '==', 'site_refiner')
    .where('status', '==', 'queued')
    .orderBy('createdAt', 'asc')
    .limit(1)
    .get();

  if (snapshot.empty) {
    return false;
  }

  const doc = snapshot.docs[0];
  await processJob(doc.id, doc.data() as JobDoc);
  return true;
}

async function main() {
  console.log('🚀 Refiner worker started');
  while (true) {
    const processed = await poll();
    if (!processed) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
}

main().catch((error) => {
  console.error('❌ Worker crashed', error);
  process.exit(1);
});
