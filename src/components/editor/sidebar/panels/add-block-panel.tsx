'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Smartphone, 
  Layout, 
  ImageIcon, 
  Phone, 
  BarChart, 
  Sparkles,
  Search,
  Plus,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { suggestNextBlocksAction } from '@/app/actions/ai';
import type { SitePage, Block } from '@/lib/types';
import type { SuggestNextBlocksOutput } from '@/types/block-suggestions'; // Updated import path

interface AddBlockPanelProps {
    page: SitePage;
    onPageUpdate: (page: SitePage) => void;
}

const BLOCK_LIBRARY = [
    {
        category: 'Smart & Intelligence',
        blocks: [
            { type: 'chat-agent', name: 'Expert Chat Agent', icon: Bot, badge: 'New', desc: 'Expert Smart that knows all projects.' },
            { type: 'roi-calculator', name: 'ROI Calculator', icon: BarChart, desc: 'Real-time property math.' },
        ]
    },
    {
        category: 'Growth & Leads',
        blocks: [
            { type: 'sms-lead', name: 'SMS VIP Broadcast', icon: Smartphone, badge: 'High Conversion', desc: 'Capture numbers for SMS/WhatsApp.' },
            { type: 'cta-form', name: 'Smart Lead Form', icon: Phone, desc: 'Optimized for mobile leads.' },
        ]
    },
    {
        category: 'Property Data',
        blocks: [
            { type: 'listing-grid', name: 'Project Grid', icon: Layout, desc: 'Showcase multiple developments.' },
            { type: 'search-filters', name: 'Advanced Search', icon: Search, desc: 'Filter by area, price, and developer.' },
            { type: 'floor-plan', name: 'Interactive Floor Plans', icon: ImageIcon, desc: 'Visual unit selection.' },
        ]
    }
];

export function AddBlockPanel({ page, onPageUpdate }: AddBlockPanelProps) {
  const [suggestions, setSuggestions] = useState<SuggestNextBlocksOutput>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const result = await suggestNextBlocksAction({
          currentBlocks: page.blocks.map(b => b.type),
          siteType: 'real estate property launch',
          brand: page.title || 'Luxury Homes',
          primaryColor: '#002F4B'
        });
        setSuggestions(result);
      } catch (error) {
        console.error("Failed to get block suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSuggestions();
  }, [page.blocks, page.title]);

  const addBlock = (blockType: string, defaultContent?: any) => {
    const newBlock: Block = {
        blockId: `${blockType}-${Date.now()}`,
        type: blockType,
        order: page.blocks.length,
        data: defaultContent || { headline: `New ${blockType} Section` }
    };
    
    onPageUpdate({
        ...page,
        blocks: [...page.blocks, newBlock]
    });
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
       <div className="p-4 border-b border-white/5 bg-zinc-950/30">
          <h3 className="font-bold text-sm text-zinc-100 uppercase tracking-widest flex items-center gap-2">
            <Plus className="h-4 w-4 text-blue-500" />
            Add Block
          </h3>
       </div>

       <div className="p-4 space-y-8">
          {/* Smart Recommendation Hook */}
          <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-2xl p-4 border border-blue-500/20">
             <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-3 w-3 text-blue-400" />
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Architect Suggestions</span>
             </div>
             {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                </div>
             ) : suggestions.length > 0 ? (
              <div className="space-y-2">
                {suggestions.slice(0, 2).map((sugg) => (
                  <div key={sugg.blockId}>
                     <p className="text-xs text-zinc-400 mb-2">Add the <strong>{sugg.blockId}</strong> block to improve conversions.</p>
                     <button 
                        onClick={() => addBlock(sugg.blockId, sugg.defaultContent)}
                        className="text-[10px] font-bold text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                     >
                        Apply Suggestion
                     </button>
                  </div>
                ))}
              </div>
             ) : (
              <p className="text-xs text-zinc-500">No suggestions available at this time.</p>
             )}
          </div>

          {BLOCK_LIBRARY.map((group) => (
             <div key={group.category} className="space-y-3">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">{group.category}</h4>
                <div className="grid grid-cols-1 gap-2">
                   {group.blocks.map((block) => (
                      <div 
                        key={block.type}
                        onClick={() => addBlock(block.type)}
                        className="group p-4 rounded-xl bg-zinc-800/30 border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 cursor-pointer transition-all"
                      >
                         <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                               <block.icon className="h-4 w-4 text-zinc-400 group-hover:text-blue-400" />
                               <span className="text-sm font-bold text-zinc-200">{block.name}</span>
                            </div>
                            {block.badge && (
                               <Badge className="bg-blue-600/10 text-blue-400 border-0 text-[8px] h-4 px-1.5">
                                  {block.badge}
                               </Badge>
                            )}
                         </div>
                         <p className="text-[10px] text-zinc-500 leading-tight">{block.desc}</p>
                      </div>
                   ))}
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}
