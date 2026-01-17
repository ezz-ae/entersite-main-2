'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layout, 
  Palette, 
  Smartphone, 
  Search, 
  Rocket,
  MousePointerClick,
  BarChart3,
  Plus,
  Sparkles
} from 'lucide-react';

export function BuilderMotionShowcase() {
  return (
    <section className="py-32 bg-black border-y border-white/10 overflow-hidden relative">
      {/* Fire Gradient Mesh */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute top-[-20%] right-[10%] w-[800px] h-[800px] bg-orange-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-[-20%] left-[10%] w-[700px] h-[700px] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '9s' }} />
      </div>
      
      <div className="container mx-auto px-6 max-w-[1800px] relative z-10">
        
        <div className="text-center max-w-4xl mx-auto mb-24 space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.1] text-white">
            The Builder <br/>
            <span className="text-zinc-500">Reimagined for Growth.</span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
             A workspace that feels like a creative studio. Drag, drop, and design with intelligence baked into every pixel.
          </p>
        </div>

        {/* The UI Mockup */}
        <motion.div 
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative w-full"
        >
            {/* Glow behind the window */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-3xl blur-3xl opacity-30" />
            
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden aspect-[16/9] group">
                {/* Window Header */}
                <div className="h-14 border-b border-white/5 bg-black/50 flex items-center px-6 gap-4 backdrop-blur-md">
                    <div className="flex gap-2 mr-4">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    
                    {/* Device Toggles */}
                    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/5">
                        <div className="p-1.5 rounded bg-white/10 text-white"><Layout className="h-3.5 w-3.5" /></div>
                        <div className="p-1.5 rounded hover:bg-white/5 text-zinc-500"><Smartphone className="h-3.5 w-3.5" /></div>
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                         <div className="bg-green-500/10 text-green-500 text-[10px] font-bold px-3 py-1 rounded-full border border-green-500/20 uppercase tracking-wider">
                             Auto-Saving
                         </div>
                         <div className="h-8 w-24 bg-white text-black rounded-lg flex items-center justify-center text-xs font-bold">
                            Preview
                         </div>
                    </div>
                </div>

                {/* UI Layout */}
                <div className="flex h-full">
                    {/* Left Sidebar (Navigator) */}
                    <div className="w-20 border-r border-white/5 bg-black flex flex-col items-center py-8 gap-8 z-10">
                        {[Layout, Palette, Search, BarChart3].map((Icon, i) => (
                            <div key={i} className="w-12 h-12 rounded-2xl flex items-center justify-center text-zinc-500 hover:bg-white/5 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-white/10">
                                <Icon className="h-6 w-6" />
                            </div>
                        ))}
                    </div>
                    
                    {/* Center Canvas */}
                    <div className="flex-1 bg-[#111] p-8 md:p-16 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
                        
                        {/* The "Site" Being Built */}
                        <motion.div 
                            initial={{ scale: 0.9 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 1.5 }}
                            className="w-full h-full max-w-5xl bg-black rounded-xl shadow-2xl border border-white/10 flex flex-col overflow-hidden relative z-10"
                        >
                            {/* Header Block */}
                            <div className="h-[60%] bg-zinc-900 relative flex items-center justify-center overflow-hidden border-b border-white/5">
                                <motion.div 
                                    animate={{ scale: [1, 1.05] }}
                                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200')] bg-cover opacity-30 grayscale"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                
                                <div className="text-center space-y-6 relative z-10 px-12 w-full max-w-2xl">
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="h-16 w-full bg-white/5 backdrop-blur-md rounded-xl border border-white/10"
                                    />
                                    <div className="flex justify-center gap-4">
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7 }}
                                            className="h-12 w-40 bg-white rounded-full shadow-lg" 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Grid Block - Being "Dropped" */}
                            <div className="flex-1 p-8 grid grid-cols-3 gap-6 bg-black relative">
                                {[1,2,3].map(i => (
                                    <div key={i} className="bg-zinc-900/50 rounded-xl border border-white/5 h-full relative overflow-hidden">
                                        <div className="h-[60%] bg-white/5" />
                                        <div className="p-4 space-y-3">
                                            <div className="h-3 w-3/4 bg-white/10 rounded" />
                                            <div className="h-2 w-1/2 bg-white/5 rounded" />
                                        </div>
                                    </div>
                                ))}
                                
                                {/* The "Add Block" hover effect */}
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 1.5, duration: 1 }}
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                >
                                    <div className="w-full h-px bg-blue-500/50 absolute top-1/2 shadow-[0_0_15px_#3b82f6]" />
                                    <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full z-20 shadow-lg flex items-center gap-2">
                                        <Plus className="h-3 w-3" /> Add Section Here
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Animated Cursor */}
                        <motion.div 
                            className="absolute top-[60%] left-[50%] pointer-events-none z-30 drop-shadow-2xl"
                            animate={{ x: [0, 120, 120, 0], y: [0, 60, 0, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                            <MousePointerClick className="h-10 w-10 text-white fill-black" />
                            <div className="ml-5 mt-2 bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl border border-black/10">
                                Smart Architect is optimizing...
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Sidebar (Inspector) */}
                    <div className="w-80 border-l border-white/5 bg-black p-6 space-y-8 hidden lg:block z-10">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="h-3 w-20 bg-white/20 rounded" />
                                <div className="h-2 w-2 bg-green-500 rounded-full" />
                            </div>
                            <div className="h-10 w-full bg-zinc-900 rounded-lg border border-white/10" />
                        </div>
                        <div className="space-y-4">
                            <div className="h-3 w-24 bg-white/20 rounded" />
                            <div className="h-32 w-full bg-zinc-900 rounded-lg border border-white/10" />
                        </div>
                        <div className="p-4 bg-gradient-to-br from-orange-900/20 to-purple-900/20 rounded-xl border border-white/10">
                             <div className="flex items-center gap-2 mb-2">
                                 <Sparkles className="h-3 w-3 text-orange-400" />
                                 <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Smart Suggestion</span>
                             </div>
                             <div className="h-2 w-full bg-white/10 rounded mb-2" />
                             <div className="h-2 w-2/3 bg-white/10 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>

      </div>
    </section>
  );
}
