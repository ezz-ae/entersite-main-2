import type { Block } from '@/lib/types';

const CHAT_AGENT_BLOCK_TYPES = new Set(['chat-agent', 'chat-widget']);

export function hasChatAgent(blocks: Block[] | null | undefined): boolean {
  return (blocks || []).some((block) => CHAT_AGENT_BLOCK_TYPES.has(block.type));
}
