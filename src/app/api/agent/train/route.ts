'use server';

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import {
  enforceUsageLimit,
  PlanLimitError,
  planLimitErrorResponse,
} from '@/lib/server/billing';
import { getAdminDb } from '@/server/firebase-admin';
import { enforceSameOrigin } from '@/lib/server/security';

export async function POST(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    await enforceUsageLimit(getAdminDb(), tenantId, 'ai_agents', 1);
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file type. Only PDF is accepted.' }, { status: 400 });
    }

    // Save the file to a temporary directory
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const tempFilePath = join(tmpdir(), file.name);
    await fs.writeFile(tempFilePath, fileBuffer);
    
    // In a real application, you would process the PDF and train the agent.
    // For this example, we'll just log that the file was received.
    console.log(`Received training file: ${file.name}`);

    await fs.unlink(tempFilePath);

    return NextResponse.json({ message: 'Agent training started.', fileName: file.name });

  } catch (error) {
    console.error('Agent Training API Error:', error);
    if (error instanceof PlanLimitError) {
      return NextResponse.json(planLimitErrorResponse(error), { status: 402 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred during training.' }, { status: 500 });
  }
}
