'use client';

import React from 'react';
import { InteractiveAgentCreator } from '@/components/ai-tools/interactive-agent-creator';

export default function ChatAgentPage() {
  return (
    <div className="animate-in fade-in duration-700">
      <InteractiveAgentCreator />
    </div>
  );
}
