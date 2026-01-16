'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Sparkles, GripHorizontal, BarChart3, Map, Image as ImageIcon, Layout, Type, MousePointerClick, Table, User } from "lucide-react";
import Link from 'next/link';

// Detailed mock blocks representing actual site components
const BLOCKS_DATA = [
  { id: 1, type: "hero", title: "Hero Section", w: 400, h: 250, z: 20 },
  { id: 2, type: "grid", title: "Property Grid", w: 350, h: 400, z: 15 },
  { id: 3, type: "chart", title: "ROI Calculator", w: 300, h: 280, z: 18 },
  { id: 4, type: "form", title: "Lead Capture", w: 280, h: 320, z: 22 },
  { id: 5, type: "map", title: "Location Map", w: 320, h: 240, z: 12 },
  { id: 6, type: "stats", title: "Market Stats", w: 340, h: 140, z: 25 },
  { id: 7, type: "image", title: "Gallery", w: 300, h: 200, z: 14 },
  { id: 8, type: "nav", title: "Navigation", w: 380, h: 60, z: 30 },
  { id: 9, type: "text", title: "About Us", w: 260, h: 220, z: 10 },
  { id: 10, type: "table", title: "Payment Plan", w: 310, h: 260, z: 16 },
  { id: 11, type: "hero", title: "Launch Banner", w: 360, h: 200, z: 19 },
  { id: 12, type: "grid", title: "Featured List", w: 290, h: 350, z: 13 },
  { id: 13, type: "profile", title: "Agent Profile", w: 240, h: 280, z: 21 },
  { id: 14, type: "form", title: "Contact Us", w: 270, h: 300, z: 17 },
  { id: 15, type: "video", title: "Video Tour", w: 330, h: 210, z: 23 },
  { id: 16, type: "chart", title: "Growth Trends", w: 280, h: 220, z: 11 },
  { id: 17, type: "stats", title: "Key Features", w: 300, h: 100, z: 24 },
];

export function CuriosityHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [initialBlocks, setInitialBlocks] = useState<any[]>([]);

  useEffect(() => {
    // This effect runs only on the client
    if (typeof window !== 'undefined') {
      const windowSize = { w: window.innerWidth, h: window.innerHeight };
      
      const scatteredBlocks = BLOCKS_DATA.map((b, i) => ({
        ...b,
        x: (Math.random() - 0.5) * (windowSize.w * 0.8),
        y: (Math.random() - 0.5) * (windowSize.h * 0.8),
        rotate: Math.random() * 20 - 10,
      }));

      setInitialBlocks(scatteredBlocks);
    }
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full bg-[#0a0a0a] overflow-hidden flex items-center justify-center perspective-1000"
    >
        {/* The Hidden \"Treasure\" Layer */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-0 px-4 pointer-events-none select-none">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.8, duration: 1.2 }}
                className="space-y-8 relative z-10"
            >
                <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-zinc-400 mb-4 font-medium tracking-wide">
                    The all-in-one platform for real estate
                </div>
                
                <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter max-w-5xl leading-[0.9]">
                    Beyond the <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400">Blueprint.</span> <br/>
                    Build Your Real Estate Legacy.
                </h1>
                
                <p className="text-zinc-400 text-xl md:text-2xl max-w-3xl mx-auto font-light">
                    The all-in-one platform to design, market, and manage your properties, powered by Smart.
                </p>

                <div className="pointer-events-auto pt-8">
                    <Link href="/builder">
                        <Button size="lg" className="h-16 px-12 text-xl rounded-full bg-white text-black hover:bg-zinc-200 hover:scale-105 transition-all shadow-[0_0_50px_-10px_rgba(255,255,255,0.2)] font-semibold">
                            <Sparkles className="mr-2 h-5 w-5 fill-black" />
                            Start Building Now
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>

        {/* The Draggable Block Pile */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="relative w-full h-full flex items-center justify-center">
                {initialBlocks.map((block) => (
                    <DraggableBlock key={block.id} block={block} containerRef={containerRef} />
                ))}
            </div>
        </div>
        
        {/* Hint text */}
        <div className="absolute bottom-10 left-0 right-0 text-center z-20 pointer-events-none text-white/20 text-sm animate-pulse tracking-widest uppercase">
            Drag the blocks to clear your workspace
        </div>
    </section>
  );
}

function DraggableBlock({ block, containerRef }: { block: any, containerRef: React.RefObject<HTMLDivElement> }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotate = useMotionValue(block.rotate);
    
    // Set initial position in an effect to avoid server/client mismatch
    useEffect(() => {
        x.set(block.x);
        y.set(block.y);
    }, [block, x, y]);

    // While dragging, scale up slightly
    const scale = useTransform(x, [-200, 200], [1, 1]); 

    return (
        <motion.div
            drag
            dragConstraints={containerRef}
            dragElastic={0.2}
            dragMomentum={true}
            whileHover={{ scale: 1.02, cursor: "grab", zIndex: 100, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
            whileDrag={{ scale: 1.05, cursor: "grabbing", rotate: 0, zIndex: 100, boxShadow: "0 35px 60px -15px rgba(0, 0, 0, 0.6)" }}
            style={{ x, y, rotate, zIndex: block.z, width: block.w, height: block.h }}
            className="absolute pointer-events-auto rounded-xl shadow-2xl border border-white/10 bg-zinc-900/90 backdrop-blur-md overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: block.y > 0 ? -500 : 500, scale: 0.5 }}
            animate={{ opacity: 1, y: block.y, scale: 1 }}
            transition={{ type: "spring", stiffness: 40, damping: 15, delay: Math.random() * 0.8 }}
        >
            {/* Header / Chrome */}
            <div className="h-8 bg-white/5 border-b border-white/5 flex items-center justify-between px-3 shrink-0">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-white/30">{block.title}</div>
                <GripHorizontal className="w-4 h-4 text-white/20" />
            </div>

            {/* Block Content (Visual Representation) */}
            <div className="flex-1 p-4 relative overflow-hidden">
                {renderBlockContent(block.type)}
                
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" />
            </div>
        </motion.div>
    )
}

// Helper to render "mini" versions of our actual blocks
function renderBlockContent(type: string) {
    switch(type) {
        case 'hero':
            return (
                <div className="flex flex-col h-full gap-4">
                    <div className="flex-1 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300')] bg-cover opacity-20 grayscale"></div>
                        <h1 className="text-lg font-bold text-white/80 relative z-10">Premium Living</h1>
                    </div>
                    <div className="h-8 bg-white/10 rounded w-1/3 mx-auto" />
                </div>
            );
        case 'grid':
            return (
                <div className="grid grid-cols-2 gap-3 h-full">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white/5 rounded-lg border border-white/5 p-2 flex flex-col gap-2">
                            <div className="flex-1 bg-white/10 rounded" />
                            <div className="h-2 bg-white/10 rounded w-2/3" />
                            <div className="h-2 bg-white/10 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            );
        case 'chart':
            return (
                <div className="flex flex-col h-full gap-3">
                    <div className="flex justify-between items-end h-3/4 gap-2 px-2">
                        {[40, 70, 50, 90, 60, 80].map((h, i) => (
                            <div key={i} className="flex-1 bg-emerald-500/30 rounded-t-sm" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                    <div className="h-px bg-white/20 w-full" />
                    <div className="flex justify-between">
                        <div className="h-2 w-8 bg-white/10 rounded" />
                        <div className="h-2 w-8 bg-white/10 rounded" />
                        <div className="h-2 w-8 bg-white/10 rounded" />
                    </div>
                </div>
            );
        case 'form':
            return (
                <div className="space-y-3 h-full flex flex-col justify-center">
                    <div className="space-y-1">
                        <div className="h-2 w-16 bg-white/20 rounded" />
                        <div className="h-8 bg-white/5 border border-white/10 rounded w-full" />
                    </div>
                    <div className="space-y-1">
                        <div className="h-2 w-16 bg-white/20 rounded" />
                        <div className="h-8 bg-white/5 border border-white/10 rounded w-full" />
                    </div>
                    <div className="h-8 bg-indigo-500/40 rounded w-full mt-2" />
                </div>
            );
        case 'map':
            return (
                <div className="h-full w-full bg-zinc-800 rounded-lg relative overflow-hidden border border-white/10">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                </div>
            );
        case 'stats':
            return (
                <div className="flex items-center justify-around h-full">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="text-center space-y-1">
                            <div className="text-2xl font-bold text-white/80">10k+</div>
                            <div className="h-1.5 w-12 bg-white/20 rounded mx-auto" />
                        </div>
                    ))}
                </div>
            );
        case 'nav':
            return (
                <div className="flex items-center justify-between h-full px-4">
                    <div className="w-8 h-8 rounded bg-white/20" />
                    <div className="flex gap-4">
                        <div className="w-12 h-2 bg-white/20 rounded" />
                        <div className="w-12 h-2 bg-white/20 rounded" />
                        <div className="w-12 h-2 bg-white/20 rounded" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20" />
                </div>
            );
        case 'table':
            return (
                <div className="space-y-2 h-full">
                    <div className="h-8 bg-white/10 rounded w-full mb-2" />
                    {[1,2,3,4].map(i => (
                        <div key={i} className="h-6 bg-white/5 rounded w-full flex gap-2">
                            <div className="w-1/4 h-full bg-white/5 rounded" />
                            <div className="w-1/4 h-full bg-white/5 rounded" />
                            <div className="w-1/2 h-full bg-white/5 rounded" />
                        </div>
                    ))}
                </div>
            );
        case 'video':
            return (
                <div className="h-full w-full bg-black rounded-lg relative border border-white/10 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-red-500" />
                    </div>
                </div>
            );
        case 'profile':
            return (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                    <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 relative overflow-hidden">
                         <User className="w-12 h-12 text-white/20 absolute bottom-0 left-1/2 -translate-x-1/2" />
                    </div>
                    <div className="h-3 w-32 bg-white/20 rounded" />
                    <div className="h-2 w-24 bg-white/10 rounded" />
                    <div className="flex gap-2 mt-2">
                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10" />
                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10" />
                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10" />
                    </div>
                </div>
            );
        default:
            return (
                <div className="h-full flex items-center justify-center">
                    <Layout className="w-12 h-12 text-white/10" />
                </div>
            );
    }
}
