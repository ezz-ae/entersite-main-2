import { getPublishedSite } from '@/server/publish-service';
import { PageRenderer } from '@/components/page-renderer';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ siteId: string }>;
  searchParams?: Promise<{ variant?: string }>;
}

// Revalidate every 60 seconds
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteId } = await params;
  const page = await getPublishedSite(siteId);

  if (!page) {
    return {
      title: 'Site Not Found',
    };
  }

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description,
    keywords: page.seo?.keywords,
  };
}

export default async function PublishedPage({ params, searchParams }: Props) {
  const { siteId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const variant = resolvedSearchParams?.variant;
  const page = await getPublishedSite(siteId);

  if (!page) {
    notFound();
  }

  const shouldUseRefined = variant === 'refined';
  const refinedSnapshot = shouldUseRefined ? page.refinerDraftSnapshot : undefined;
  const refinedHtml = shouldUseRefined && !refinedSnapshot ? page.refinerDraftHtml : undefined;
  const pageToRender = refinedSnapshot ? { ...refinedSnapshot, id: refinedSnapshot.id || page.id } : page;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {shouldUseRefined && (
        <div className="bg-amber-100 text-amber-800 text-sm text-center py-3 px-4 border-b border-amber-200">
          Viewing the draft version for <span className="font-semibold">{page.title}</span>. Remove <code className="bg-white/60 px-2 py-0.5 rounded text-xs">?variant=refined</code> to see the live version.
        </div>
      )}

      {refinedHtml ? (
        <div className="prose prose-lg mx-auto px-4 py-10" dangerouslySetInnerHTML={{ __html: refinedHtml }} />
      ) : (
        <PageRenderer page={pageToRender} tenantId={pageToRender.tenantId} projectName={pageToRender.title} />
      )}
      
      {/* "Made with EntreSite" Badge */}
      <div className="fixed bottom-4 right-4 z-50">
        <a 
            href="/" 
            target="_blank" 
            className="bg-black/80 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-black transition-colors flex items-center gap-1 shadow-lg"
        >
            <span>⚡ Made with EntreSite</span>
        </a>
      </div>
    </main>
  );
}
