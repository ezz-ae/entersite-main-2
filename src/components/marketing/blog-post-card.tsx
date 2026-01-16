'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BrainCircuit, Zap, Activity, Sparkles } from 'lucide-react';
import type { BlogPost } from '@/server/content';

const ICONS: Record<string, any> = {
  BrainCircuit,
  Zap,
  Activity,
  Sparkles,
};

interface Props {
  post: BlogPost;
  index: number;
}

export function BlogPostCard({ post, index }: Props) {
  const Icon = ICONS[post.icon || 'Sparkles'] || Sparkles;

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="h-full bg-zinc-900/50 border border-white/10 rounded-[3rem] p-10 flex flex-col hover:border-blue-500/30 transition-all duration-500 group-hover:bg-zinc-900"
      >
        <div className="mb-12 flex justify-between items-start">
             <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all">
                <Icon className="h-8 w-8" />
             </div>
             <Badge className="bg-white/10 text-zinc-400 border-white/10 py-1.5 px-4 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {post.category}
             </Badge>
        </div>

        <div className="space-y-4 mb-12">
             <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                <span>{post.date}</span>
                <div className="w-1 h-1 rounded-full bg-blue-500/40" />
                <span>{post.author}</span>
             </div>
             <h3 className="text-3xl font-bold leading-tight group-hover:text-white transition-colors">
                {post.title}
             </h3>
             <p className="text-lg text-zinc-500 font-light leading-relaxed line-clamp-3">
                {post.excerpt}
             </p>
        </div>

        <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 group-hover:text-white transition-all">Read Insight</span>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <ArrowRight className="h-5 w-5" />
            </div>
        </div>
      </motion.div>
    </Link>
  );
}
