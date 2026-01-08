import { NextRequest, NextResponse } from "next/server";
import { loadInventoryProjects } from '@/server/inventory';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '12', 10), 50);

    try {
        const projects = await loadInventoryProjects(limit);
        return NextResponse.json({ data: projects });
    } catch (error) {
        console.error('[projects] failed to load inventory_projects', error);
    }

    return NextResponse.json({ data: [] });
}
