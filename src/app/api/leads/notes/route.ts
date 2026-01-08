import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';

const firestore = getAdminDb();

export async function POST(req: NextRequest) {
    try {
        const { leadId, note, userId } = await req.json();

        if (!leadId || !note || !userId) {
            return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const noteRef = await firestore.collection('leads').doc(leadId).collection('notes').add({
            text: note,
            userId,
            timestamp: new Date(),
        });

        return new NextResponse(JSON.stringify({ id: noteRef.id }), { status: 201 });
    } catch (error) {
        console.error('Error adding note:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to add note' }), { status: 500 });
    }
}
