import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/server';
import { getAuth } from '@/lib/helpers/auth';

export async function POST(req: Request) {
  try {
    const { user } = await getAuth(req);
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { name, email, phone, message } = await req.json();

    if (!name || !email) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const leadRef = await adminDb.collection('leads').add({
      ownerUid: user.uid,
      name,
      email,
      phone,
      message,
      status: 'New',
      priority: 'Warm',
      source: 'Manual Entry',
      createdAt: new Date().toISOString(),
    });

    return new NextResponse(JSON.stringify({ id: leadRef.id }), { status: 201 });

  } catch (error) {
    console.error('Error creating lead:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
