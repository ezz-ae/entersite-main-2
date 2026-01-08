'use client';

import React from 'react';
import { ImageGenTool } from '@/components/ai-tools/image-gen-tool';

export default function AiToolsPage() {
  return (
    <div className="animate-in fade-in duration-700">
      <ImageGenTool />
    </div>
  );
}
