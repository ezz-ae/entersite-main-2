import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadLocalBlogPost } from '@/server/local-blog';

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} | Entrestate Blog`,
    description: 'Entrestate market insights and execution notes.',
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await loadLocalBlogPost(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-black text-white py-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <article className="prose prose-invert max-w-none prose-headings:tracking-tight prose-a:text-blue-300 prose-a:no-underline hover:prose-a:underline">
          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>
      </div>
    </main>
  );
}
