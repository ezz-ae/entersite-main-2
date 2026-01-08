import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, UnauthorizedError, ForbiddenError } from '@/server/auth';

const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const TEAM_ID = process.env.VERCEL_TEAM_ID;

const requestSchema = z.object({
  domain: z.string().min(3),
});

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    if (!VERCEL_TOKEN || !PROJECT_ID) {
      return NextResponse.json({ error: 'Vercel credentials missing' }, { status: 500 });
    }

    const { domain } = requestSchema.parse(await req.json());

    const response = await fetch(`https://api.vercel.com/v9/projects/${PROJECT_ID}/domains${TEAM_ID ? `?teamId=${TEAM_ID}` : ''}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to add domain' }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      config: {
        aRecord: '76.76.21.21',
        cname: 'cname.vercel-dns.com',
      },
    });
  } catch (error) {
    console.error('Vercel API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
