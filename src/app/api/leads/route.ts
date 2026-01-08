import { NextRequest, NextResponse } from 'next/server';
import { FirebaseError } from 'firebase/app';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';

// IMPORTANT: This function is using the client-side SDK. 
// This is not ideal for a production environment.
// We should migrate this to the Firebase Admin SDK as soon as possible.

export async function POST(req: NextRequest) {
    try {
        const { pageSlug, projectId, name, phone, email, message } = await req.json();

        if (!pageSlug || !projectId || !name || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await addDoc(collection(db, 'leads'), {
            pageSlug,
            projectId,
            name,
            phone,
            email,
            message,
            createdAt: serverTimestamp(),
        });

        // TODO: Add email notification to the broker

        return NextResponse.json({ message: 'Lead captured successfully' });

    } catch (error) {
        console.error("API Error:", error);

        if (error instanceof FirebaseError) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
