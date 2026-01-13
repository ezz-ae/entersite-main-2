import { NextRequest, NextResponse } from 'next/server';
import { loadInventoryProjectById } from '@/server/inventory';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('id');

  if (!projectId) {
    return NextResponse.json({ error: 'Missing id parameter. Usage: ?id=some-id' }, { status: 400 });
  }

  try {
    console.log(`[test/project-lookup] Starting lookup for ID: ${projectId}`);
    const start = Date.now();
    const project = await loadInventoryProjectById(projectId);
    const duration = Date.now() - start;

    return NextResponse.json({
      found: !!project,
      duration: `${duration}ms`,
      data: project || null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}