'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sparkles, 
  ImageIcon, 
  Loader2, 
  Download, 
  RefreshCcw, 
  Maximize2,
  Zap,
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { authorizedFetch } from '@/lib/auth-fetch';

export function ImageGenTool() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await authorizedFetch('/api/ai/create-image', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setGeneratedImage(data.url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Imagen 3 Studio</h2>
          <p className="text-muted-foreground">Architectural-grade property renders powered by Vertex Smart.</p>
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
              <Zap className="h-3 w-3 mr-1" /> Ultra HD
           </Badge>
           <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
              <Sparkles className="h-3 w-3 mr-1" /> Photorealistic
           </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Controls */}
        <div className="space-y-8">
           <Card className="border-white/5 bg-zinc-900/50 backdrop-blur-xl">
              <CardHeader>
                 <CardTitle className="text-sm uppercase tracking-[0.2em] text-zinc-500">Visual Architect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400">Describe the Property</label>
                    <Textarea 
                       placeholder="e.g. A modern penthouse in Dubai Marina at sunset, floor-to-ceiling glass, infinity pool, cinematic lighting..."
                       className="min-h-[120px] bg-black/40 border-white/10 rounded-2xl p-4 text-white focus:ring-orange-500/50 resize-none"
                       value={prompt}
                       onChange={(e) => setPrompt(e.target.value)}
                    />
                 </div>

                 <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-zinc-500 uppercase">Ratio</label>
                       <div className="h-10 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center text-xs font-bold">16:9</div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-zinc-500 uppercase">Style</label>
                       <div className="h-10 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center text-xs font-bold">Cinematic</div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-zinc-500 uppercase">Quality</label>
                       <div className="h-10 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center text-xs font-bold">8K Render</div>
                    </div>
                 </div>

                 <Button 
                    className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg shadow-xl shadow-orange-900/20 group transition-all active:scale-95"
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                 >
                    {isGenerating ? (
                       <> <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Materializing... </>
                    ) : (
                       <> <Sparkles className="mr-2 h-5 w-5" /> Create Render </>
                    )}
                 </Button>
              </CardContent>
           </Card>

           <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Generation Tips</h4>
              <div className="grid grid-cols-1 gap-3">
                 <TipItem text="Mention specific lighting like 'Golden Hour' or 'Blue Hour'." />
                 <TipItem text="Use architectural styles: 'Modernist', 'Brutalist', or 'Art Deco'." />
                 <TipItem text="Include interior details: 'Marble finishes', 'Oak flooring'." />
              </div>
           </div>
        </div>

        {/* Output Preview */}
        <div className="relative">
           <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-blue-600 rounded-[2.5rem] blur-2xl opacity-20" />
           
           <div className="relative aspect-square lg:aspect-auto lg:h-full min-h-[500px] bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden flex items-center justify-center shadow-2xl">
              {isGenerating ? (
                 <div className="text-center space-y-4 z-10">
                    <div className="relative w-20 h-20 mx-auto">
                        <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-40 animate-pulse" />
                        <Loader2 className="h-20 w-20 text-orange-500 animate-spin relative z-10" />
                    </div>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Architectural Model Loading...</p>
                 </div>
              ) : generatedImage ? (
                 <motion.div 
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-full relative group"
                 >
                    <Image src={generatedImage} alt="Generated Property" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                       <Button size="icon" variant="secondary" className="rounded-full h-12 w-12"><Download className="h-5 w-5" /></Button>
                       <Button size="icon" variant="secondary" className="rounded-full h-12 w-12"><Maximize2 className="h-5 w-5" /></Button>
                       <Button size="icon" variant="secondary" className="rounded-full h-12 w-12" onClick={handleGenerate}><RefreshCcw className="h-5 w-5" /></Button>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                       <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Generated Output</p>
                       <p className="text-xs text-white line-clamp-1">{prompt}</p>
                    </div>
                 </motion.div>
              ) : (
                 <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10">
                       <ImageIcon className="h-10 w-10 text-zinc-700" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl font-bold text-zinc-300">No Image Generated</h3>
                       <p className="text-sm text-zinc-500 max-w-xs mx-auto">Enter a prompt on the left to start generating high-end property renders.</p>
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

function TipItem({ text }: { text: string }) {
   return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
         <CheckCircle2 className="h-4 w-4 text-orange-500" />
         <span className="text-xs text-zinc-300">{text}</span>
      </div>
   )
}
