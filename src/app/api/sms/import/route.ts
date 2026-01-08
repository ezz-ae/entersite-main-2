'use server';

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';
import { tmpdir } from 'os';
import { join } from 'path';

export async function POST(req: NextRequest) {
  try {
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
    });

    // Validate records
    if (!records.length || !records[0].hasOwnProperty('phone')) {
        await fs.unlink(tempFilePath);
        return NextResponse.json({ error: 'CSV must contain a \'phone\' column.' }, { status: 400 });
    }

    // Here you would typically save the contacts to your database
    // For this example, we'll just count them
    const importedCount = records.length;

    console.log(`Successfully parsed ${importedCount} contacts.`);

    await fs.unlink(tempFilePath);

    return NextResponse.json({ message: 'Import successful', count: importedCount });

  } catch (error) {
    console.error('Import API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during import.' }, { status: 500 });
  }
}
