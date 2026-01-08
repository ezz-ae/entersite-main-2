import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { z } from 'zod';
import { getGoogleModel, FLASH_MODEL } from '@/lib/ai/google';
import { getAdminDb } from '@/server/firebase-admin';
import { ENTRESTATE_INVENTORY } from '@/data/entrestate-inventory';
import type { ProjectData } from '@/lib/types';

const requestSchema = z.object({
  message: z.string().min(1),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'agent']),
        text: z.string(),
      })
    )
    .optional(),
  context: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = requestSchema.parse(body);

    const historyText = (payload.history || [])
      .map((entry) => `${entry.role === 'user' ? 'Investor' : 'Agent'}: ${entry.text}`)
      .join('\n');

    const relevantProjects = await loadRelevantProjects(payload.message, payload.context);
    const projectContext = relevantProjects.length
      ? `\nRelevant listings:\n${relevantProjects.map(formatProjectContext).join('\n')}`
      : '';

    const prompt = `
Character Profile & Context:
${payload.context || 'Entrestate chat assistant for UAE real estate teams.'}

You are a UAE real estate advisor with a helpful, concise tone.
Answer questions clearly for non-technical users.
If asked about Dubai/UAE investment topics (fees, visas, payment plans, ROI, financing), give high-level guidance and say details should be confirmed with the broker.
If you mention pricing or returns, say they are estimates and should be confirmed.
If you do not know, say so and offer next steps.
${projectContext}

Conversation History:
${historyText}

Investor: ${payload.message}
Agent:
`;

    const { text } = await generateText({
      model: getGoogleModel(FLASH_MODEL),
      system:
        'You are the Entrestate real estate assistant. Use a friendly, professional tone. Never sound robotic.',
      prompt,
    });

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('[bot/preview/chat] error', error);
    return NextResponse.json({ reply: "I'm analyzing that project's latest data. How else can I help?" });
  }
}

const CACHE_TTL_MS = 10 * 60 * 1000;
let cachedProjects: ProjectData[] = [];
let cachedAt = 0;

async function loadProjects(): Promise<ProjectData[]> {
  const now = Date.now();
  if (cachedProjects.length && now - cachedAt < CACHE_TTL_MS) {
    return cachedProjects;
  }

  try {
    const db = getAdminDb();
    const snapshot = await db.collection('inventory_projects').limit(4000).get();
    cachedProjects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ProjectData[];
    cachedAt = now;
    return cachedProjects;
  } catch (error) {
    console.error('[bot/preview/chat] failed to load inventory, using fallback', error);
    cachedProjects = ENTRESTATE_INVENTORY;
    cachedAt = now;
    return cachedProjects;
  }
}

async function loadRelevantProjects(message: string, context?: string) {
  const projects = await loadProjects();
  const query = `${message || ''} ${context || ''}`.toLowerCase();
  const terms = query.split(/[^a-z0-9]+/i).filter((term) => term.length > 2);

  if (!terms.length) {
    return projects.slice(0, 6);
  }

  const scored = projects
    .map((project) => {
      const haystack = [
        project.name,
        project.developer,
        project.location?.city,
        project.location?.area,
        project.description?.short,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      let score = 0;
      terms.forEach((term) => {
        if (haystack.includes(term)) {
          score += term.length > 4 ? 2 : 1;
        }
      });
      return { project, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((item) => item.project);

  return scored.length ? scored : projects.slice(0, 6);
}

function formatProjectContext(project: ProjectData) {
  const location = project.location?.area || project.location?.city || 'UAE';
  const price = project.price?.label || 'Price on request';
  const handover = project.handover ? `Q${project.handover.quarter} ${project.handover.year}` : 'TBD';
  const status = project.availability || project.status || 'Available';
  const highlights = project.features?.slice(0, 3).join(', ');

  return `- ${project.name} (${location}) • ${price} • ${status} • Handover ${handover}${highlights ? ` • ${highlights}` : ''}`;
}
