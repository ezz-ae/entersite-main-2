'use server';

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';
import { tmpdir } from 'os';
import { join } from 'path';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';

export async function POST(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (file.type !== 'text/csv') {
      return NextResponse.json({ error: 'Invalid file type. Only CSV is accepted.' }, { status: 400 });
    }

    // Read file content
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const tempFilePath = join(tmpdir(), file.name);
    await fs.writeFile(tempFilePath, fileBuffer);
    
    const fileContent = await fs.readFile(tempFilePath, 'utf-8');
    
    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    }) as Array<Record<string, string>>;

    // Validate records
    if (!records.length || !records[0].hasOwnProperty('email')) {
        await fs.unlink(tempFilePath);
        return NextResponse.json({ error: 'CSV must contain an \'email\' column.' }, { status: 400 });
    }

    const db = getAdminDb();
    const batch = db.batch();
    let importedCount = 0;

    records.forEach((record) => {
      const emailRaw = String(record.email || '').trim().toLowerCase();
      if (!emailRaw || !emailRaw.includes('@')) {
        return;
      }

      const nameParts = [
        record.name,
        record.first_name,
        record.last_name,
      ].filter(Boolean);
      const name = nameParts.length ? String(nameParts.join(' ')).trim() : undefined;

      const docId = `${tenantId}_${Buffer.from(emailRaw).toString('base64url')}`;
      const docRef = db.collection('contacts').doc(docId);
      batch.set(
        docRef,
        {
          tenantId,
          channel: 'email',
          email: emailRaw,
          name,
          source: 'import',
          updatedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      importedCount += 1;
    });

    if (importedCount > 0) {
      await batch.commit();
    }

    await fs.unlink(tempFilePath);

    return NextResponse.json({ message: 'Import successful', count: importedCount });

  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('Import API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during import.' }, { status: 500 });
  }
}
