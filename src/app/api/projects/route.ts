import { NextRequest, NextResponse } from 'next/server';
import { loadInventoryProjects } from '@/server/inventory';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '12', 10), 50);

    try {
        await requireRole(req, ALL_ROLES);
        const projects = await loadInventoryProjects(limit);
        return NextResponse.json({ data: projects });
    } catch (error) {
        console.error('[projects] failed to load inventory_projects', error);
        if (error instanceof UnauthorizedError) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error instanceof ForbiddenError) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
    }

    return NextResponse.json({ data: [] });
}
