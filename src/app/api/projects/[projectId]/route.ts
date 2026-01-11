import { NextRequest, NextResponse } from 'next/server';
import { loadInventoryProjectById } from '@/server/inventory';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

export async function GET(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ projectId: string }> }
) {
  const params = await paramsPromise;
  const projectId = params?.projectId;
  if (!projectId) {
    return NextResponse.json({ message: 'Project id is required.' }, { status: 400 });
  }

  try {
    await requireRole(req, ALL_ROLES);
    const project = await loadInventoryProjectById(projectId);
    if (!project) {
      return NextResponse.json({ message: 'Project not found.' }, { status: 404 });
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error('[projects/:projectId] failed to load project', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json(
      { message: 'Could not load project right now. Please try again.' },
      { status: 500 }
    );
  }
}
