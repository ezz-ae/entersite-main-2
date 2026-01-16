import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse-fork';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

export async function POST(req: NextRequest) {
    try {
        await requireRole(req, ALL_ROLES);
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return new NextResponse(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const data = await pdf(buffer);

        return new NextResponse(JSON.stringify({ text: data.text }), { status: 200 });
    } catch (error) {
        console.error('Error parsing PDF:', error);
        if (error instanceof UnauthorizedError) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        if (error instanceof ForbiddenError) {
            return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
        }
        return new NextResponse(JSON.stringify({ error: 'Failed to parse PDF' }), { status: 500 });
    }
}
