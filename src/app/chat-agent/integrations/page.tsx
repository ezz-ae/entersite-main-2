import { ModuleShell } from '@/components/module-shell';

export default function ChatAgentIntegrationsPage() {
  return (
    <ModuleShell
      title="Chat Agent Integrations"
      description="Connect the agent to website, Instagram, WhatsApp, and direct links."
      actions={[
        { label: 'Back to agent', href: '/chat-agent', variant: 'outline' },
      ]}
    />
  );
}
