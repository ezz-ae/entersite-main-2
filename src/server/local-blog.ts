import fs from 'node:fs/promises';
import path from 'node:path';
import { readMarkdownDir, readMarkdownFile } from '@/server/markdown';
import type { BlogPost } from '@/server/content';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function firstParagraph(markdown: string) {
  const lines = markdown.split('\n').map((l) => l.trim());
  const idx = lines.findIndex((l) => l && !l.startsWith('#') && !l.startsWith('>'));
  if (idx === -1) return '';
  return lines[idx].replace(/[*_`]/g, '').slice(0, 180);
}

export async function fetchLocalBlogPosts(limit = 12): Promise<BlogPost[]> {
  try {
    const docs = await readMarkdownDir(BLOG_DIR, limit);
    return docs.map((doc) => ({
      id: doc.slug,
      title: doc.title,
      excerpt: firstParagraph(doc.markdown) || 'Entrestate market note.',
      author: 'Entrestate',
      date: '2026-01-16',
      category: 'Execution',
      icon: 'Sparkles',
      slug: doc.slug,
    }));
  } catch {
    return [];
  }
}

export async function loadLocalBlogPost(slug: string) {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  try {
    await fs.access(file);
  } catch {
    return null;
  }
  return readMarkdownFile(file, slug);
}
