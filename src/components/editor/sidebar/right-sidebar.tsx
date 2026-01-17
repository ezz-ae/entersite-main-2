'use client';

import React from 'react';
import { Block } from '@/lib/types';
import { Settings, Sliders, ChevronRight, Sparkles } from 'lucide-react';

interface RightSidebarProps {
    selectedBlock: Block | null;
    onUpdateBlock: (newData: any) => void;
}

export function RightSidebar({ selectedBlock, onUpdateBlock }: RightSidebarProps) {
    if (!selectedBlock) {
        return (
            <div className="w-80 h-full bg-zinc-950 border-l border-white/5 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
                    <Sliders className="h-6 w-6 text-zinc-600" />
                </div>
                <h3 className="text-lg font-bold text-zinc-300">Inspector</h3>
                <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
                    Select a block on the canvas to edit its properties, styles, and content.
                </p>
            </div>
        );
    }

    return (
        <div className="w-80 h-full bg-zinc-950 border-l border-white/5 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-black/40">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Editing Block</span>
                    <Settings className="h-3 w-3 text-zinc-600" />
                </div>
                <h3 className="text-xl font-bold text-white capitalize">{selectedBlock.type.replace('-', ' ')}</h3>
            </div>

            {/* Smart Assistant Hook */}
            <div className="p-4">
                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-4 border border-indigo-500/20 group hover:border-indigo-500/40 transition-all cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-indigo-400" />
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Smart Optimizer</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                        Rewrite headlines or optimize images for this {selectedBlock.type} based on current market trends.
                    </p>
                    <div className="flex items-center text-[10px] font-bold text-white group-hover:gap-2 transition-all">
                        Optimize Content <ChevronRight className="h-3 w-3" />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
                {/* Dynamic Controls based on Block Data */}
                {Object.entries(selectedBlock.data).map(([key, value]) => {
                    if (typeof value === 'string') {
                        return (
                            <div key={key} className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{key}</label>
                                <textarea 
                                    className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px] resize-none"
                                    value={value}
                                    onChange={(e) => onUpdateBlock({ ...selectedBlock.data, [key]: e.target.value })}
                                />
                            </div>
                        )
                    }
                    return null;
                })}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-white/5 bg-black/20">
                <button className="w-full h-12 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
                    Apply Changes
                </button>
            </div>
        </div>
    );
}
