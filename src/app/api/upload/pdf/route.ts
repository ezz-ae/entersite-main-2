import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse-fork';

export async function POST(req: NextRequest) {
    try {
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
        return new NextResponse(JSON.stringify({ error: 'Failed to parse PDF' }), { status: 500 });
    }
}
