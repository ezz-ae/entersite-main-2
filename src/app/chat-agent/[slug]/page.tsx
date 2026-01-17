import { ModulePlaceholder, formatSlugTitle } from '@/components/module-placeholder';

export default async function ChatAgentSubpage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <ModulePlaceholder
      module="Chat Agent"
      homeHref="/chat-agent"
      title={formatSlugTitle(slug)}
      description="Agent setup, knowledge, and takeover controls live here."
    />
  );
}
