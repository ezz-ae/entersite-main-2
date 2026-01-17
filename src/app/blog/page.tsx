import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BrainCircuit } from 'lucide-react';
import { BlogPostCard } from '@/components/marketing/blog-post-card';
import { fetchBlogPosts, BlogPost } from '@/server/content';
import { shouldUseRemoteContent } from '@/server/remote-config';
import { fetchLocalBlogPosts } from '@/server/local-blog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Market Insights Blog | Entrestate',
  description: 'Insights for brokers, marketing, and UAE real estate trends.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Market Insights Blog | Entrestate',
    description: 'Insights for brokers, marketing, and UAE real estate trends.',
    url: '/blog',
  },
};

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 'uae-market-2025',
    title: 'UAE Real Estate 2025: The Rise of Smart Agents',
    excerpt: 'How artificial intelligence is turning local brokerages into global investment engines.',
    author: 'Sarah Jenkins',
    date: 'Oct 12, 2025',
    category: 'Intelligence',
    icon: 'BrainCircuit',
    slug: 'uae-market-2025',
  },
  {
    id: 'brochure-to-conversion',
    title: 'Turning PDF Brochures into High-Yield Portals',
    excerpt: 'The science behind the automated architect engine and why it works for investors.',
    author: 'David Chen',
    date: 'Oct 08, 2025',
    category: 'Productivity',
    icon: 'Zap',
    slug: 'brochure-to-conversion',
  },
  {
    id: 'meta-lookalike-strategy',
    title: 'Leveraging Market Signals for Meta Ads',
    excerpt: 'A deep dive into how Entrestate builds custom audiences for off-plan launches.',
    author: 'James Wilson',
    date: 'Sep 15, 2025',
    category: 'Marketing',
    icon: 'Activity',
    slug: 'meta-lookalike-strategy',
  },
];

export default async function BlogPage() {
  const canUseRemote = shouldUseRemoteContent;
  const remote = canUseRemote ? (await fetchBlogPosts()) : [];
  const local = await fetchLocalBlogPosts(12);
  const posts = remote.length > 0 ? remote : local;
  const data = posts.length > 0 ? posts : DEFAULT_POSTS;

  return (
    <main className="min-h-screen bg-black text-white py-40">
      <div className="container mx-auto px-6 max-w-[1800px]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-white/5 pb-16 gap-12">
            <div className="max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-widest">
                    <Sparkles className="h-3 w-3" /> Intelligence Blog
                </div>
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none">
                    Market <br/>
                    <span className="text-zinc-600">Intelligence.</span>
                </h1>
                <p className="text-2xl text-zinc-400 font-light leading-relaxed">
                    Strategies, product updates, and data-driven insights from the Entrestate engineering and marketing teams.
                </p>
            </div>
            <div className="flex gap-4">
                <Card className="px-6 py-4 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Total Articles</p>
                    <p className="text-2xl font-black text-white">{(posts.length || 124).toLocaleString()}</p>
                </Card>
                <Card className="px-6 py-4 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Subscribers</p>
                    <p className="text-2xl font-black text-white">Growing</p>
                </Card>
            </div>
        </div>

        {/* Featured Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {data.map((post, i) => (
                <BlogPostCard key={post.id} post={post} index={i} />
            ))}
        </div>

        {/* Newsletter Callout */}
        <section className="mt-40 p-20 rounded-[4rem] bg-blue-600 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="absolute top-0 right-0 p-12 opacity-10">
                <BrainCircuit className="h-64 w-64" />
            </div>
            <div className="max-w-2xl relative z-10 space-y-4">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">Join the Intelligence.</h2>
                <p className="text-xl text-blue-100 font-medium">Get UAE market trends and Smart strategy guides delivered weekly.</p>
            </div>
            <div className="w-full md:w-auto relative z-10 flex flex-col sm:flex-row gap-3">
                <input 
                    placeholder="Enter your email" 
                    className="h-16 px-8 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-blue-200 text-lg w-full md:w-80 backdrop-blur-xl focus:outline-none"
                />
                <button className="h-16 px-12 rounded-full bg-white text-blue-600 font-black text-xl hover:scale-105 transition-transform">
                    Subscribe
                </button>
            </div>
        </section>

      </div>
    </main>
  );
}
