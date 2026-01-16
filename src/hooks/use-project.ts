'use client';

import { useState } from 'react';
import type { SitePage, Block, SiteTemplate } from '@/lib/types';
import { availableTemplates } from '@/lib/templates';

export function useProject() {
  const [pages, setPages] = useState<SitePage[]>(availableTemplates[0].pages);
  const [activePageId, setActivePageId] = useState<string>(availableTemplates[0].pages[0].id);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<SiteTemplate>(availableTemplates[0]);

  const activePage = pages.find(p => p.id === activePageId);
  const selectedBlock = activePage?.blocks.find(b => b.blockId === selectedBlockId) || null;

  return {
    pages, setPages,
    activePageId, setActivePageId,
    selectedBlockId, setSelectedBlockId,
    currentTemplate, setCurrentTemplate,
    activePage,
    selectedBlock,
  };
}
