import { NextRequest, NextResponse } from 'next/server';
import { loadInventoryProjectById } from '@/server/inventory';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';

export async function GET(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ projectId: string }> }
) {
  // Public read-only inventory detail; no auth or tenant writes allowed.
  const params = await paramsPromise;
  const projectId = params?.projectId;
  if (!projectId) {
    return NextResponse.json({ message: 'Project id is required.' }, { status: 400 });
  }

  try {
    const ip = getRequestIp(req);
    if (!(await enforceRateLimit(`projects:detail:${ip}`, 120, 60_000))) {
      return NextResponse.json({ message: 'Rate limit exceeded' }, { status: 429 });
    }
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
