
import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';

const firestore = getAdminDb();

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const leadId = searchParams.get('leadId');

        if (!leadId) {
            return new NextResponse(JSON.stringify({ error: 'Lead ID is required' }), { status: 400 });
        }

        const notesSnapshot = await firestore.collection('leads').doc(leadId).collection('notes').orderBy('timestamp', 'desc').get();
        const notes = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return new NextResponse(JSON.stringify(notes), { status: 200 });
    } catch (error) {
        console.error('Error fetching notes:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to fetch notes' }), { status: 500 });
    }
}
