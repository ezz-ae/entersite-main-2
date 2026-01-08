'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Layers, Paintbrush, Plus, SidebarClose, SidebarOpen, Search, Globe, Target } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { NavigatorPanel } from './panels/navigator-panel';
import { ThemePanel } from './panels/theme-panel';
import { AddBlockPanel } from './panels/add-block-panel';

import type { SitePage, Block } from '@/lib/types';

interface LeftSidebarProps {
    page: SitePage;
    onPageUpdate: (page: SitePage) => void;
    onOpenSeo?: () => void;
    selectedBlockId?: string | null;
    onSelectBlock?: (block: Block | null) => void;
}

export function LeftSidebar({
    page,
    onPageUpdate,
    onOpenSeo,
    selectedBlockId,
    onSelectBlock
}: LeftSidebarProps) {
    const [activeView, setActiveView] = useState<string | null>('navigator');
    
    const handleViewChange = (view: string) => {
        setActiveView(activeView === view ? null : view);
    };

    return (
        <div className="flex h-full bg-zinc-900 transition-all duration-300">
            
            {/* Main Icon Navbar */}
            <div className="w-16 flex-shrink-0 flex flex-col items-center justify-between py-4 bg-zinc-950 border-r border-white/5">
                <div className="flex flex-col items-center gap-2">
                    <SidebarButton 
                        label="Navigator" 
                        icon={Layers} 
                        isActive={activeView === 'navigator'} 
                        onClick={() => handleViewChange('navigator')} 
                    />
                    <SidebarButton 
                        label="Add Blocks" 
                        icon={Plus} 
                        isActive={activeView === 'add'} 
                        onClick={() => handleViewChange('add')} 
                    />
                    <SidebarButton 
                        label="Marketing & SEO" 
                        icon={Target} 
                        onClick={onOpenSeo} 
                    />
                    <SidebarButton 
                        label="Theme" 
                        icon={Paintbrush} 
                        isActive={activeView === 'theme'} 
                        onClick={() => handleViewChange('theme')} 
                    />
                </div>
                <SidebarButton 
                    label={activeView ? "Close Panel" : "Open Panel"}
                    icon={activeView ? SidebarClose : SidebarOpen}
                    onClick={() => setActiveView(null)}
                />
            </div>

            {/* Sliding Panel Content */}
            <AnimatePresence mode="wait">
            {activeView && (
                <motion.div 
                    key={activeView}
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="w-72 bg-zinc-900 border-r border-white/10 shadow-2xl flex flex-col"
                >
                    {activeView === 'navigator' && (
                        <NavigatorPanel 
                            pages={[page]} 
                            activePage={page} 
                            onPageChange={() => {}} 
                            selectedBlockId={selectedBlockId || null}
                            onSelectBlock={onSelectBlock || (() => {})}
                        />
                    )}
                    {activeView === 'add' && <AddBlockPanel page={page} onPageUpdate={onPageUpdate} />}
                    {activeView === 'theme' && <ThemePanel onClose={() => setActiveView(null)} />}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
}


const SidebarButton = ({ label, icon: Icon, isActive, onClick }: any) => (
    <button 
        onClick={onClick} 
        aria-label={label}
        className={cn(
            "p-3 rounded-xl w-12 h-12 transition-all duration-200 relative group",
            isActive 
                ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                : "text-zinc-500 hover:bg-white/5 hover:text-white"
        )}
    >
        <Icon className="h-5 w-5 mx-auto" />
        <div className="absolute left-full ml-3 px-2 py-1 bg-black text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
            {label}
        </div>
    </button>
)
