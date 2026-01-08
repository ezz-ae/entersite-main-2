import { suggestNextBlocksFlow } from '@/ai/flows/suggest-next-blocks';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const result = await suggestNextBlocksFlow.run(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
