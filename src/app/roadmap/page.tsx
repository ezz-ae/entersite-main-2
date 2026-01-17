import type { Metadata } from 'next';
import path from 'node:path';
import { readMarkdownFile } from '@/server/markdown';

export const metadata: Metadata = {
  title: 'Roadmap | Entrestate',
  description: 'Planned improvements and version strategy for Entrestate.',
  alternates: { canonical: '/roadmap' },
  openGraph: {
    title: 'Roadmap | Entrestate',
    description: 'Planned improvements and version strategy for Entrestate.',
    url: '/roadmap',
  },
};

export default async function RoadmapPage() {
  const file = path.join(process.cwd(), 'docs', 'ROADMAP.md');
  const doc = await readMarkdownFile(file, 'roadmap');

  return (
    <main className="min-h-screen bg-black text-white py-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <article className="prose prose-invert max-w-none prose-headings:tracking-tight prose-a:text-blue-300 prose-a:no-underline hover:prose-a:underline">
          <h1>{doc.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: doc.html }} />
        </article>
      </div>
    </main>
  );
}
