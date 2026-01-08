import { loadDocSummaries } from '@/server/docs';
import { DocsPageContent } from '@/components/docs/docs-page-content';

export default async function DocsPage() {
  const recentDocs = await loadDocSummaries();
  return <DocsPageContent recentDocs={recentDocs} />;
}
