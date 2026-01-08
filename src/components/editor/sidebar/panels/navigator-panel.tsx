'use client';

import React from 'react';
import type { SitePage, Block } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown, File, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigatorPanelProps {
    pages: SitePage[];
    activePage: SitePage;
    onPageChange: (id: string) => void;
    selectedBlockId: string | null;
    onSelectBlock: (block: Block | null) => void;
}

export function NavigatorPanel({ 
    pages, 
    activePage, 
    onPageChange, 
    selectedBlockId,
    onSelectBlock
}: NavigatorPanelProps) {
    const [popoverOpen, setPopoverOpen] = React.useState(false);

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-white/10">
                <h3 className="font-bold text-lg text-white">Navigator</h3>
                <p className="text-xs text-zinc-400">Manage your pages and layers.</p>
            </div>

            {/* Page Selector */}
            <div className="p-2 border-b border-white/10">
                 <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                        <button className="w-full flex items-center justify-between text-left p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors">
                            <span className="text-sm font-medium text-white truncate">{activePage.title}</span>
                            <ChevronsUpDown className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0 bg-zinc-800 border-white/10 text-white" side="bottom" align="start">
                        <Command>
                            <CommandInput placeholder="Search page..." className="h-9 bg-transparent border-0 focus:ring-0 ring-offset-0" />
                            <CommandList>
                                <CommandGroup>
                                    {pages.map(page => (
                                        <CommandItem
                                            key={page.id}
                                            value={page.title}
                                            onSelect={() => {
                                                onPageChange(page.id);
                                                setPopoverOpen(false);
                                            }}
                                            className="aria-selected:bg-blue-600"
                                        >
                                            <File className="mr-2 h-4 w-4" />
                                            {page.title}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                                <CommandGroup className="border-t border-white/10 pt-1">
                                     <CommandItem className="text-green-400 aria-selected:bg-green-600/20">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add New Page
                                    </CommandItem>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            
            {/* Block Tree */}
            <div className="flex-1 overflow-y-auto py-2">
                <div className="flex flex-col">
                    {activePage.blocks.sort((a, b) => a.order - b.order).map(block => (
                        <button 
                            key={block.blockId}
                            onClick={() => onSelectBlock(block)}
                            className={cn(
                                "w-full text-left px-4 py-2 text-sm transition-colors",
                                block.blockId === selectedBlockId
                                    ? 'bg-blue-600/80 text-white font-semibold'
                                    : 'text-zinc-300 hover:bg-white/5'
                            )}
                        >
                           {block.type}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
