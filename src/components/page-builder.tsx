'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Sparkles, Layout } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Block as BlockType, SitePage } from '@/lib/types';
import { BlockCard } from '@/components/block-card';
import { HeroBlock } from '@/components/blocks/hero-block';
import { ListingGridBlock } from './blocks/listing-grid-block';
import { CtaFormBlock } from './blocks/cta-form-block';
import { GalleryBlock } from './blocks/gallery-block';
import { FaqBlock } from './blocks/faq-block';
import { TestimonialBlock } from './blocks/testimonial-block';
import { RoadshowBlock } from './blocks/roadshow-block';
import { TeamBlock } from './blocks/team-block';
import { ProjectDetailBlock } from './blocks/project-detail-block';
import { BrochureFormBlock } from './blocks/forms/brochure-form-block';
import { OfferBlock } from './blocks/forms/offer-block';
import { HeroLeadFormBlock } from './blocks/forms/hero-lead-form-block';
import { LeadInterestFormBlock } from './blocks/forms/lead-interest-form-block';
import { BookingViewingBlock } from './blocks/forms/booking-viewing-block';
import { FloorPlanBlock } from './blocks/floor-plan-block';
import { FeaturesBlock } from './blocks/features-block';
import { LaunchBlock } from './blocks/launch-block';
import { ListingGridMapBlock } from './blocks/listings/listing-grid-map-block';
import { ChatWidgetBlock } from './blocks/social/chat-widget-block';
import { BlogGridBlock } from './blocks/content/blog-grid-block';
import { MortgageCalculatorBlock } from './blocks/finance/mortgage-calculator-block';
import { PaymentPlanBlock } from './blocks/finance/payment-plan-block';
import { VideoBlock } from './blocks/content/video-block';
import { ContactDetailsBlock } from './blocks/info/contact-details-block';
import { PartnersBlock } from './blocks/content/partners-block';
import { StatsBlock } from './blocks/info/stats-block';
import { NewsletterBlock } from './blocks/forms/newsletter-block';
import { SplitContentBlock } from './blocks/content/split-content-block';
import { FeaturedListingBlock } from './blocks/listings/featured-listing-block';
import { SearchWithFiltersBlock } from './blocks/search/search-with-filters-block';
import { CityGuideBlock } from './blocks/content/city-guide-block';
import { RoiCalculatorBlock } from './blocks/finance/roi-calculator-block';
import { DevelopersListBlock } from './blocks/content/developers-list-block';
import { LaunchHeroBlock } from './blocks/hero/launch-hero-block';
import { ComingSoonHeroBlock } from './blocks/hero/coming-soon-hero-block';
import { CtaGridBlock } from './blocks/cta/cta-grid-block';
import { BannerCtaBlock } from './blocks/cta/banner-cta-block';
import { ChatAgentBlock } from './blocks/ai/chat-agent-block';
import { SmsLeadBlock } from './blocks/marketing/sms-lead-block';
import { Button } from './ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BlockGallery } from './block-gallery';
import { SortableItem } from '@/components/ui/sortable/sortable-item';
import { SuggestNextBlocksOutput } from '@/types/block-suggestions';
import { Separator } from './ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MapBlock } from './blocks/map-block';
import { SiteBlockContext, LEAD_CAPTURE_BLOCKS } from './blocks/block-context';

const blockComponents: Record<string, React.ComponentType<any>> = {
  'hero': HeroBlock,
  'listing-grid': ListingGridBlock,
  'cta-form': CtaFormBlock,
  'map': MapBlock,
  'gallery': GalleryBlock,
  'testimonial': TestimonialBlock,
  'faq': FaqBlock,
  'roadshow': RoadshowBlock,
  'team': TeamBlock,
  'project-detail': ProjectDetailBlock,
  'brochure-form': BrochureFormBlock,
  'offer': OfferBlock,
  'hero-lead-form': HeroLeadFormBlock,
  'lead-interest-form': LeadInterestFormBlock,
  'floor-plan': FloorPlanBlock,
  'features': FeaturesBlock,
  'launch': LaunchBlock,
  'listing-grid-map': ListingGridMapBlock,
  'chat-widget': ChatWidgetBlock,
  'blog-grid': BlogGridBlock,
  'mortgage-calculator': MortgageCalculatorBlock,
  'payment-plan': PaymentPlanBlock,
  'video': VideoBlock,
  'contact-details': ContactDetailsBlock,
  'partners': PartnersBlock,
  'stats': StatsBlock,
  'newsletter': NewsletterBlock,
  'booking-viewing': BookingViewingBlock,
  'split-content': SplitContentBlock,
  'featured-listing': FeaturedListingBlock,
  'search-filters': SearchWithFiltersBlock,
  'city-guide': CityGuideBlock,
  'roi-calculator': RoiCalculatorBlock,
  'developers-list': DevelopersListBlock,
  'launch-hero': LaunchHeroBlock,
  'coming-soon-hero': ComingSoonHeroBlock,
  'cta-grid': CtaGridBlock,
  'banner-cta': BannerCtaBlock,
  'chat-agent': ChatAgentBlock,
  'sms-lead': SmsLeadBlock,
};

const renderBlock = (block: BlockType, context?: SiteBlockContext) => {
  const Component = blockComponents[block.type];
  if (!Component) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-100 rounded-lg">
        Unknown block type: {block.type}
      </div>
    );
  }
  const leadProps = LEAD_CAPTURE_BLOCKS.has(block.type)
    ? {
        tenantId: context?.tenantId,
        projectName: context?.projectName,
        siteId: context?.siteId,
      }
    : {};
  const chatProps = block.type === 'chat-agent' ? { siteId: context?.siteId } : {};
  return <Component {...block.data} {...leadProps} {...chatProps} />;
};

const AddBlockPopover = ({ onSelectBlock, currentBlocks, variant = 'default' }: { onSelectBlock: (blockType: string, data?: any) => void, currentBlocks: string[], variant?: 'default' | 'mini' }) => {
  const [suggestions, setSuggestions] = useState<SuggestNextBlocksOutput>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
        setSuggestions([]);
        setLoading(false);
    }
  }, [open]);

  const handleSuggest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/suggest-next-blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentBlocks: currentBlocks,
          siteType: 'developer-launch',
          brand: 'Prestige',
          primaryColor: '#002F4B'
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const result = await response.json();
      setSuggestions(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (type: string, data?: any) => {
      onSelectBlock(type, data);
      setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {variant === 'default' ? (
            <Button variant="ghost" className="h-12 w-full max-w-sm rounded-xl border-2 border-dashed border-primary/20 text-primary/60 hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-all duration-300 gap-2">
                <Plus className="h-5 w-5" />
                <span className="font-medium">Add Block</span>
            </Button>
        ) : (
            <Button size="icon" className="h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform">
                <Plus className="h-4 w-4" />
            </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[420px] p-0 rounded-2xl shadow-2xl border-0 overflow-hidden" align="center" sideOffset={10}>
          <div className="bg-muted/30 p-4 border-b">
            <h4 className="font-semibold text-sm">Add Content</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select a block to add it to your page.
            </p>
          </div>
          
          <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-900/50">
                  <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                           <div className="bg-white dark:bg-white/10 p-1.5 rounded-lg shadow-sm">
                               <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                           </div>
                           <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">Recommendations</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={handleSuggest} 
                        disabled={loading}
                        className="h-7 text-xs hover:bg-white/50"
                      >
                        {loading ? 'Generating...' : 'Refresh'}
                      </Button>
                  </div>
                  
                   {loading && (
                      <div className="space-y-2 animate-pulse mt-2">
                          <div className="h-10 bg-white/50 rounded-lg w-full"></div>
                          <div className="h-10 bg-white/50 rounded-lg w-full delay-75"></div>
                      </div>
                   )}

                  {suggestions.length > 0 && !loading ? (
                     <div className="space-y-2 mt-2">
                        {suggestions.map((suggestion, i) => (
                            <motion.button
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={suggestion.blockId}
                                onClick={() => handleSelect(suggestion.blockId, { ...(suggestion.defaultContent as any), ...(suggestion.recommendedStyleOverrides as any) })}
                                className="w-full text-left p-3 rounded-lg bg-white dark:bg-black/20 hover:shadow-md hover:scale-[1.02] transition-all text-sm flex items-center justify-between group border border-transparent hover:border-indigo-100"
                            >
                                <div>
                                    <span className="font-medium block capitalize text-indigo-950 dark:text-indigo-50">{suggestion.blockId.replace(/-/g, ' ')}</span>
                                    <span className="text-xs text-muted-foreground block mt-0.5 opacity-80">Recommended for conversion</span>
                                </div>
                                <Plus className="h-4 w-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                        ))}
                     </div>
                  ) : !loading && (
                      <div className="text-center py-4">
                          <p className="text-xs text-muted-foreground mb-2">
                              Let Smart analyze your page and suggest the perfect next block.
                          </p>
                          <Button size="sm" onClick={handleSuggest} className="bg-white text-indigo-600 hover:bg-white/90 shadow-sm border border-indigo-100">
                              Create Suggestions
                          </Button>
                      </div>
                  )}
              </div>

              <Separator className="my-2" />
              
              <div>
                  <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">Library</h5>
                  <BlockGallery onSelectBlock={(type) => handleSelect(type)} />
              </div>
          </div>
      </PopoverContent>
    </Popover>
  );
};

interface PageBuilderProps {
  page: SitePage;
  onPageUpdate: (page: SitePage) => void;
  selectedBlockId?: string | null;
  onSelectBlock?: (block: BlockType | null) => void;
}

export function PageBuilder({ page, onPageUpdate, selectedBlockId, onSelectBlock }: PageBuilderProps) {
  const [blocks, setBlocks] = useState<BlockType[]>(page.blocks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const siteContext = useMemo<SiteBlockContext>(() => ({
    tenantId: page.tenantId || 'public',
    projectName: page.title,
    siteId: page.id,
  }), [page.id, page.tenantId, page.title]);

  useEffect(() => {
    setBlocks(page.blocks);
  }, [page]);
  
  const updatePage = (newBlocks: BlockType[]) => {
    setBlocks(newBlocks);
    onPageUpdate({
      ...page,
      blocks: newBlocks,
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5,
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addBlock = (blockType: string, data?: any, index?: number) => {
    const newBlock: BlockType = {
      blockId: blockType + "-" + Date.now(),
      type: blockType,
      order: 0,
      data: data || {
        headline: "New Headline",
        subtext: "New subtext",
      },
    };
    
    const newBlocksList = [...blocks];
    const targetIndex = index !== undefined ? index : newBlocksList.length;
    newBlocksList.splice(targetIndex, 0, newBlock);

    const reorderedBlocks = newBlocksList.map((block, i) => ({
      ...block,
      order: i,
    }));
    
    updatePage(reorderedBlocks);
  };
  
  const updateBlock = (blockId: string, newData: any) => {
      const updatedBlocks = blocks.map(b => 
          b.blockId === blockId ? { ...b, data: newData } : b
      );
      updatePage(updatedBlocks);
  };

  const deleteBlock = (blockId: string) => {
      const updatedBlocks = blocks.filter(b => b.blockId !== blockId).map((block, i) => ({
          ...block,
          order: i
      }));
      updatePage(updatedBlocks);
      if (onSelectBlock && selectedBlockId === blockId) {
          onSelectBlock(null);
      }
  };
  
  const duplicateBlock = (blockId: string) => {
      const blockIndex = blocks.findIndex(b => b.blockId === blockId);
      if (blockIndex === -1) return;
      
      const blockToClone = blocks[blockIndex];
      const newBlock = {
          ...blockToClone,
          blockId: blockToClone.type + "-" + Date.now() + "-copy",
          data: { ...blockToClone.data, headline: (blockToClone.data.headline || '') + " (Copy)" }
      };
      
      const newBlocksList = [...blocks];
      newBlocksList.splice(blockIndex + 1, 0, newBlock);
      
      updatePage(newBlocksList.map((b, i) => ({ ...b, order: i })));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    const block = blocks.find(b => b.blockId === event.active.id);
    if (block && onSelectBlock) onSelectBlock(block);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
        const oldIndex = blocks.findIndex((b) => b.blockId === active.id);
        const newIndex = blocks.findIndex((b) => b.blockId === over.id);
        const movedBlocks = arrayMove(blocks, oldIndex, newIndex);
        
        const reorderedBlocks = movedBlocks.map((block, index) => ({
          ...block,
          order: index,
        }));

        updatePage(reorderedBlocks);
    }
  };

  const sortedBlocks = blocks.sort((a, b) => a.order - b.order);
  
  const dropAnimation: DropAnimation = {
      sideEffects: defaultDropAnimationSideEffects({
        styles: {
          active: {
            opacity: '0.5',
          },
        },
      }),
    };

  return (
    <div className="max-w-5xl mx-auto pb-40 px-4 md:px-0">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-6 relative">
           {sortedBlocks.length === 0 && (
             <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-muted-foreground/10 rounded-3xl bg-muted/5 animate-in fade-in zoom-in duration-500">
               <div className="bg-background p-6 rounded-full shadow-lg mb-6 ring-4 ring-muted/20">
                    <Layout className="h-10 w-10 text-muted-foreground" />
               </div>
               <h2 className="text-2xl font-bold mb-2 tracking-tight">Start Building Your Page</h2>
               <p className="text-muted-foreground mb-8 max-w-sm text-center text-lg">
                   Add your first block to begin creating your real estate masterpiece.
               </p>
               <div className="scale-110">
                   <AddBlockPopover 
                      onSelectBlock={(type, data) => addBlock(type, data, 0)}
                      currentBlocks={[]}
                    />
               </div>
             </div>
           )}

          {sortedBlocks.length > 0 && (
            <div className="flex justify-center py-4">
              <AddBlockPopover 
                onSelectBlock={(type, data) => addBlock(type, data, 0)}
                currentBlocks={sortedBlocks.map(b => b.type)}
              />
            </div>
          )}

          <SortableContext items={sortedBlocks.map(b => b.blockId)} strategy={verticalListSortingStrategy}>
            {sortedBlocks.map((block, index) => (
              <div key={block.blockId} className="group/add-block-area relative">
                <SortableItem id={block.blockId}>
                  <div 
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectBlock) onSelectBlock(block);
                    }}
                    className={cn(
                        "relative transition-all duration-200 ring-2 rounded-2xl cursor-pointer",
                        selectedBlockId === block.blockId 
                            ? "ring-primary shadow-xl scale-[1.01] z-10" 
                            : "ring-transparent hover:ring-primary/20"
                    )}
                  >
                      {selectedBlockId === block.blockId && (
                          <div className="absolute -top-3 left-4 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider z-20 shadow-sm animate-in fade-in zoom-in duration-200">
                              Selected
                          </div>
                      )}

                      <BlockCard 
                        blockType={block.type} 
                        data={block.data}
                        onUpdate={(newData) => updateBlock(block.blockId, newData)}
                        onDelete={() => deleteBlock(block.blockId)}
                        onDuplicate={() => duplicateBlock(block.blockId)}
                      >
                        {renderBlock(block, siteContext)}
                      </BlockCard>
                  </div>
                </SortableItem>
                
                <div className="absolute left-1/2 -bottom-5 -translate-x-1/2 z-30 opacity-0 group-hover/add-block-area:opacity-100 transition-all duration-200 group-hover/add-block-area:pointer-events-auto hover:scale-110">
                   <AddBlockPopover 
                      variant="mini"
                      onSelectBlock={(type, data) => addBlock(type, data, index + 1)}
                      currentBlocks={sortedBlocks.map(b => b.type)}
                   />
                </div>
              </div>
            ))}
          </SortableContext>
          
          <DragOverlay dropAnimation={dropAnimation}>
              {activeId ? (
                  <div className="opacity-90 rotate-2 scale-105 cursor-grabbing shadow-2xl rounded-2xl overflow-hidden bg-background ring-2 ring-primary">
                      <div className="h-32 bg-muted/20 flex items-center justify-center font-bold text-muted-foreground">
                          Moving Block...
                      </div>
                  </div>
              ) : null}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  );
}
