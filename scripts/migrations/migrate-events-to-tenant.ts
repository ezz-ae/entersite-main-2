import 'dotenv/config';
import { cert, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

function loadServiceAccount(): ServiceAccount {
  const explicitPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (explicitPath) {
    const filePath = path.resolve(process.cwd(), explicitPath);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const key = JSON.parse(raw);
    if (key?.type === 'service_account' && key?.project_id && key?.private_key) {
      console.log(`[migrate-events] Using GOOGLE_APPLICATION_CREDENTIALS: ${explicitPath}`);
      return {
        projectId: key.project_id,
        clientEmail: key.client_email,
        privateKey: key.private_key,
      };
    }
  }

  try {
    const files = fs.readdirSync(process.cwd()).filter((file) => file.endsWith('.json'));
    for (const file of files) {
      try {
        const filePath = path.resolve(process.cwd(), file);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const key = JSON.parse(raw);
        if (key?.type === 'service_account' && key?.project_id && key?.private_key) {
          console.log(`[migrate-events] Using service account file: ${file}`);
          return {
            projectId: key.project_id,
            clientEmail: key.client_email,
            privateKey: key.private_key,
          };
        }
      } catch {
        // Ignore non-JSON or malformed files.
      }
    }
  } catch {
    // Ignore directory scan errors.
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    console.log('[migrate-events] Using FIREBASE_* env credentials.');
    return {
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    };
  }

  throw new Error('Service account credentials not found for migration.');
}

const app = initializeApp({
  credential: cert(loadServiceAccount()),
});

const db = getFirestore(app);

const PAGE_SIZE = Number(process.env.PAGE_SIZE || '200');
const MAX_PAGES = Number(process.env.MAX_PAGES || '0');
const DRY_RUN = process.env.DRY_RUN === 'true';
const DELETE_SOURCE = process.env.DELETE_SOURCE === 'true';

async function migrateEvents() {
  console.log('[migrate-events] Starting migration');
  console.log(`[migrate-events] PAGE_SIZE=${PAGE_SIZE} DRY_RUN=${DRY_RUN} DELETE_SOURCE=${DELETE_SOURCE}`);

  let lastDoc: FirebaseFirestore.QueryDocumentSnapshot | null = null;
  let page = 0;
  let scanned = 0;
  let copied = 0;
  let skippedMissingTenant = 0;
  let deleted = 0;

  while (true) {
    let query: FirebaseFirestore.Query = db.collection('events').orderBy('__name__').limit(PAGE_SIZE);
    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();
    if (snapshot.empty) break;

    page += 1;
    let batchOps = 0;
    const batch = db.batch();

    for (const doc of snapshot.docs) {
      scanned += 1;
      const data = doc.data() as Record<string, any>;
      const tenantId = typeof data.tenantId === 'string' ? data.tenantId.trim() : '';
      if (!tenantId) {
        skippedMissingTenant += 1;
        continue;
      }

      const destRef = db.collection('tenants').doc(tenantId).collection('events').doc(doc.id);
      if (!DRY_RUN) {
        batch.set(destRef, { ...data, tenantId }, { merge: true });
        batchOps += 1;
        if (DELETE_SOURCE) {
          batch.delete(doc.ref);
          batchOps += 1;
          deleted += 1;
        }
      }
      copied += 1;
    }

    if (!DRY_RUN && batchOps > 0) {
      await batch.commit();
    }

    lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
    console.log(`[migrate-events] page=${page} scanned=${scanned} copied=${copied} skippedMissingTenant=${skippedMissingTenant}`);

    if (MAX_PAGES > 0 && page >= MAX_PAGES) {
      console.log('[migrate-events] MAX_PAGES reached, stopping early.');
      break;
    }
  }

  console.log('[migrate-events] Completed');
  console.log(`[migrate-events] scanned=${scanned}`);
  console.log(`[migrate-events] copied=${copied}`);
  console.log(`[migrate-events] skippedMissingTenant=${skippedMissingTenant}`);
  console.log(`[migrate-events] deleted=${deleted}`);
}

if (require.main === module) {
  migrateEvents().catch((err) => {
    console.error('[migrate-events] failed', err);
    process.exit(1);
  });
}
