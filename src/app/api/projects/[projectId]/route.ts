import { NextRequest, NextResponse } from 'next/server';
import { loadInventoryProjectById } from '@/server/inventory';

export async function GET(
  _req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ projectId: string }> }
) {
  const params = await paramsPromise;
  const projectId = params?.projectId;
  if (!projectId) {
    return NextResponse.json({ message: 'Project id is required.' }, { status: 400 });
  }

  try {
    const project = await loadInventoryProjectById(projectId);
    if (!project) {
      return NextResponse.json({ message: 'Project not found.' }, { status: 404 });
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error('[projects/:projectId] failed to load project', error);
    return NextResponse.json(
      { message: 'Could not load project right now. Please try again.' },
      { status: 500 }
    );
  }
}
