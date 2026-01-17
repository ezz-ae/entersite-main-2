import Link from 'next/link';
import type { Metadata } from 'next';
import path from 'node:path';
import { readMarkdownDir } from '@/server/markdown';

export const metadata: Metadata = {
  title: 'Documentation Library | Entrestate',
  description: 'Technical and operational documentation for Entrestate.',
  alternates: { canonical: '/docs/library' },
  openGraph: {
    title: 'Documentation Library | Entrestate',
    description: 'Technical and operational documentation for Entrestate.',
    url: '/docs/library',
  },
};

export default async function DocsLibraryPage() {
  const docsDir = path.join(process.cwd(), 'docs');
  const items = await readMarkdownDir(docsDir);

  return (
    <main className="min-h-screen bg-black text-white py-24">
      <div className="container mx-auto px-6 max-w-4xl space-y-10">
        <div className="space-y-3">
          <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500">Docs</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">Documentation Library</h1>
          <p className="text-zinc-400 max-w-2xl">
            Internal-style docs: clear, direct, and written for execution. Use this as your source of truth.
          </p>
        </div>

        <div className="divide-y divide-white/10 rounded-3xl border border-white/10 overflow-hidden">
          {items.map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/library/${doc.slug}`}
              className="block p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold">{doc.title}</h2>
                  <p className="text-sm text-zinc-500">/{doc.slug}</p>
                </div>
                <span className="text-zinc-600">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
