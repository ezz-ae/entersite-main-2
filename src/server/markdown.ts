import fs from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';

export type MarkdownDoc = {
  slug: string;
  title: string;
  markdown: string;
  html: string;
  filePath: string;
};

function extractTitle(markdown: string, fallback: string) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return (match?.[1] || fallback).trim();
}

export async function readMarkdownFile(absolutePath: string, slug: string): Promise<MarkdownDoc> {
  const markdown = await fs.readFile(absolutePath, 'utf8');
  const title = extractTitle(markdown, slug);
  const html = marked.parse(markdown) as string;
  return {
    slug,
    title,
    markdown,
    html,
    filePath: absolutePath,
  };
}

export async function readMarkdownDir(dirAbsolutePath: string, limit?: number) {
  const entries = await fs.readdir(dirAbsolutePath, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.md'))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));

  const sliced = typeof limit === 'number' ? files.slice(0, limit) : files;
  return Promise.all(
    sliced.map(async (name) => {
      const slug = path.parse(name).name;
      return readMarkdownFile(path.join(dirAbsolutePath, name), slug);
    })
  );
}
