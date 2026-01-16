import dotenv from 'dotenv';
import { cert, getApps, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

dotenv.config({ path: process.env.ENV_FILE || '.env.local' });

function getServiceAccount(): ServiceAccount {
  const raw = process.env.FIREBASE_ADMIN_SDK_CONFIG;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as ServiceAccount;
      if (parsed.privateKey) {
        parsed.privateKey = String(parsed.privateKey).replace(/\\n/g, '\n');
      }
      return parsed;
    } catch (error) {
      throw new Error('FIREBASE_ADMIN_SDK_CONFIG is not valid JSON.');
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.project_id;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || process.env.client_email;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY || process.env.private_key;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase admin credentials. Set FIREBASE_ADMIN_SDK_CONFIG or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY.'
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  } as ServiceAccount;
}

function initAdmin() {
  if (!getApps().length) {
    initializeApp({ credential: cert(getServiceAccount()) });
  }
}

async function seedDemo() {
  initAdmin();
  const db = getFirestore();

  const tenantId = process.env.DEMO_TENANT_ID || 'demo-entrestate';
  const siteId = process.env.DEMO_SITE_ID || 'demo-site';
  const subdomain = process.env.DEMO_SITE_SUBDOMAIN || 'demo';
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'entrestate.com';
  const siteDomain = process.env.NEXT_PUBLIC_SITE_DOMAIN || `site.${rootDomain}`;
  const nowIso = new Date().toISOString();

  const tenantRef = db.collection('tenants').doc(tenantId);
  await tenantRef.set(
    {
      id: tenantId,
      name: 'Entrestate Demo',
      slug: 'entrestate-demo',
      status: 'active',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  const siteRef = db.collection('sites').doc(siteId);
  await siteRef.set(
    {
      id: siteId,
      tenantId,
      ownerUid: 'demo-owner',
      title: 'Entrestate Demo Listing',
      blocks: [],
      canonicalListings: [],
      brochureUrl: '',
      seo: {
        title: 'Entrestate Demo',
        description: 'Demo landing page for Entrestate sales and QA.',
        keywords: ['entrestate', 'demo', 'uae'],
      },
      published: true,
      subdomain,
      publishedUrl: `https://${subdomain}.${siteDomain}`,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    { merge: true }
  );

  const leadRef = tenantRef.collection('leads').doc('demo-lead');
  await leadRef.set(
    {
      tenantId,
      siteId,
      name: 'Demo Lead',
      email: 'demo@entrestate.com',
      phone: '+971500000000',
      message: 'Interested in a demo viewing.',
      status: 'New',
      priority: 'Warm',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      source: 'Demo Seed',
    },
    { merge: true }
  );

  console.log('Demo seed complete.');
  console.log(`Tenant: ${tenantId}`);
  console.log(`Site: ${siteId} (https://${subdomain}.${siteDomain})`);
  console.log('Lead: demo-lead');
}

seedDemo().catch((error) => {
  console.error('Demo seed failed:', error.message || error);
  process.exit(1);
});
