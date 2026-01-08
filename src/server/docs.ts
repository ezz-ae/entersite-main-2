import fs from 'node:fs/promises';
import path from 'node:path';
import { DocSummary } from '@/types/docs';

const DOCS_DIR = path.join(process.cwd(), 'docs');

const trimMarkdown = (value: string) => value.replace(/[#*_`>~-]/g, '').trim();

function deriveSummary(contents: string): string {
  const lines = contents.split('\n').map((line) => line.trim());
  const bodyLine = lines.find((line) => line && !line.startsWith('#'));
  if (bodyLine) {
    return trimMarkdown(bodyLine);
  }
  return 'Internal reference documentation for Entrestate.';
}

export async function loadDocSummaries(limit = 6): Promise<DocSummary[]> {
  try {
    const entries = await fs.readdir(DOCS_DIR, { withFileTypes: true });
    const mdFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.md'));
    const docs = await Promise.all(
      mdFiles.map(async (file) => {
        const absolutePath = path.join(DOCS_DIR, file.name);
        const contents = await fs.readFile(absolutePath, 'utf8');
        const titleMatch = contents.match(/^#\s*(.+)$/m);
        const title = titleMatch ? trimMarkdown(titleMatch[1]) : path.parse(file.name).name;
        const summary = deriveSummary(contents);
        const slug = path.parse(file.name).name.toLowerCase();
        return {
          slug,
          title,
          summary,
          fileName: file.name,
          path: `docs/${file.name}`,
        } satisfies DocSummary;
      })
    );
    return docs.slice(0, limit);
  } catch (error) {
    console.error('[loadDocSummaries] Failed to read docs directory', error);
    return [];
  }
}
