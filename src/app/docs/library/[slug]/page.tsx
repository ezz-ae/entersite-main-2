import type { Metadata } from 'next';
import path from 'node:path';
import { notFound } from 'next/navigation';
import { readMarkdownFile } from '@/server/markdown';

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} | Docs | Entrestate`,
    description: 'Entrestate documentation.',
    alternates: { canonical: `/docs/library/${slug}` },
  };
}

export default async function DocsLibrarySlugPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const docsDir = path.join(process.cwd(), 'docs');
  const file = path.join(docsDir, `${slug}.md`);

  let doc: { title: string; html: string };
  try {
    doc = await readMarkdownFile(file, slug);
  } catch {
    notFound();
  }

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
