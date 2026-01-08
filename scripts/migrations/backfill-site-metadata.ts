import 'dotenv/config';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore(app);

async function backfillSiteMetadata() {
  console.log('Starting site metadata backfill...');
  const snapshot = await db.collection('sites').get();

  let updatedCount = 0;
  let skippedCount = 0;
  let missingOwnerCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const updates: Record<string, any> = {};
    const ownerUid: string | undefined = data.ownerUid;
    const currentTenant: string | undefined = data.tenantId;
    const currentTitle: string | undefined = data.title;

    if (!ownerUid) {
      missingOwnerCount += 1;
      skippedCount += 1;
      continue;
    }

    if (!currentTenant || currentTenant === 'public') {
      updates.tenantId = ownerUid;
    }

    if (!currentTitle || !currentTitle.trim()) {
      updates.title = `Entrestate Site ${doc.id.slice(0, 6)}`;
    }

    if (Object.keys(updates).length === 0) {
      skippedCount += 1;
      continue;
    }

    updates.updatedAt = new Date().toISOString();
    await doc.ref.set(updates, { merge: true });
    updatedCount += 1;
  }

  console.log(`Processed ${snapshot.size} sites.`);
  console.log(`Updated ${updatedCount} documents.`);
  console.log(`Skipped ${skippedCount} documents.`);
  if (missingOwnerCount > 0) {
    console.warn(`Skipped ${missingOwnerCount} documents because ownerUid was missing.`);
  }
}

if (require.main === module) {
  backfillSiteMetadata().catch((err) => {
    console.error('Backfill failed:', err);
    process.exit(1);
  });
}
