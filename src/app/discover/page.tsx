'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
    Search, 
    Zap, 
    Globe, 
    Activity, 
    Loader2, 
    ArrowRight, 
    TrendingUp, 
    ShieldCheck,
    Cpu,
    Building
} from "lucide-react";
import type { ProjectData } from '@/lib/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ENTRESTATE_INVENTORY } from '@/data/entrestate-inventory';

const PROJECTS_PER_PAGE = 12;

export default function DiscoverPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [page, setPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [showingSample, setShowingSample] = useState(false);

  // Database-Driven Insight State
  const [activeInsight, setActiveInsight] = useState("Yield");

  const INSIGHTS = [
    { id: 'Yield', label: 'ROI Yield', desc: 'Rental returns trending in Dubai Marina.', stat: 'High', trend: 'Trend' },
    { id: 'Handover', label: 'Handover Window', desc: 'Projects delivering across 2026.', stat: 'Upcoming', sub: 'Timeline' },
    { id: 'Appreciation', label: 'Value Growth', desc: 'Rising interest in Creek Harbour.', stat: 'Rising', trend: 'Trend' },
  ];

  const fetchProjects = useCallback(async (
    pageParam: number,
    overrides?: { query?: string; city?: string; append?: boolean }
  ) => {
    setLoading(true);
    try {
      const url = new URL('/api/projects/search', window.location.origin);
      const queryValue = overrides?.query ?? searchQuery;
      const cityValue = overrides?.city ?? selectedCity;
      const append = overrides?.append ?? false;
      url.searchParams.set('query', queryValue);
      url.searchParams.set('city', cityValue);
      url.searchParams.set('page', String(pageParam));
      url.searchParams.set('limit', String(PROJECTS_PER_PAGE));

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to fetch projects');
      const json = await res.json();
      
      const total = json.pagination?.total || 0;
      const shouldShowSample = total === 0 && !queryValue && cityValue === 'all';
      if (shouldShowSample) {
        setProjects(ENTRESTATE_INVENTORY.slice(0, pageParam * PROJECTS_PER_PAGE));
        setTotalProjects(ENTRESTATE_INVENTORY.length);
        setShowingSample(true);
      } else {
        setTotalProjects(total);
        setProjects((prev) => (append ? [...prev, ...(json.data || [])] : json.data || []));
        setShowingSample(false);
      }
      setPage(pageParam);
    } catch (error) {
      console.error('Failed to load projects', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCity]);

  useEffect(() => {
    fetchProjects(1);
  }, [fetchProjects]);

  const handleProjectClick = (projectId: string) => {
    router.push(`/discover/${encodeURIComponent(projectId)}`);
  };

  const handleLoadSample = () => {
    setProjects(ENTRESTATE_INVENTORY.slice(0, PROJECTS_PER_PAGE));
    setTotalProjects(ENTRESTATE_INVENTORY.length);
    setShowingSample(true);
    setPage(1);
  };

  const handleSearch = () => {
    const nextQuery = searchInput.trim();
    setSearchQuery(nextQuery);
  };

  const totalPages = Math.max(1, Math.ceil(totalProjects / PROJECTS_PER_PAGE));
  const showingCount = projects.length;
  const canLoadMore = showingSample
    ? projects.length < ENTRESTATE_INVENTORY.length
    : projects.length < totalProjects;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-blue-500/30">
      
      {/* 1. DATA-DRIVEN HERO */}
      <section className="bg-zinc-950 border-b border-white/5 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-5 sm:px-6 max-w-[1600px] relative z-10">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                  <div className="space-y-6 sm:space-y-8">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/10 text-blue-500 text-[10px] font-bold uppercase tracking-[0.3em] border border-blue-500/20">
                        <Activity className="h-3.5 w-3.5" />
                        Live Market Insights
                      </div>
                      <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                          Market <br/>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 uppercase italic">Feed.</span>
                      </h1>
                      <p className="text-zinc-500 text-base sm:text-lg md:text-2xl font-light leading-relaxed max-w-xl">
                          Browse project listings and market snapshots from your inventory sources.
                      </p>

                      <div className="relative group max-w-md">
                          <div className="absolute -inset-1 bg-blue-600 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-1000" />
                          <div className="relative flex items-center bg-zinc-900 border border-white/10 rounded-2xl p-2 pr-4 shadow-2xl">
                              <Search className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-600 ml-3 sm:ml-4" />
                              <input 
                                type="text" 
                                placeholder="Search projects, areas, or developers"
                                className="flex-1 bg-transparent border-none text-white placeholder:text-zinc-700 focus:outline-none h-12 sm:h-14 px-3 sm:px-4 text-base sm:text-lg font-medium"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              />
                              <Button
                                onClick={handleSearch}
                                className="h-9 sm:h-10 px-4 sm:px-5 rounded-xl bg-white text-black font-bold text-[10px] sm:text-xs uppercase tracking-widest"
                              >
                                Search
                              </Button>
                          </div>
                      </div>
                  </div>

                  {/* Insight Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {INSIGHTS.map((insight) => (
                          <div 
                            key={insight.id}
                            className={cn(
                                "p-5 sm:p-6 md:p-8 rounded-[2rem] sm:rounded-[2.5rem] border transition-all duration-500 cursor-pointer group",
                                activeInsight === insight.id ? "bg-blue-600 border-blue-500 shadow-2xl shadow-blue-900/20" : "bg-zinc-900 border-white/5 hover:border-white/10"
                            )}
                            onClick={() => setActiveInsight(insight.id)}
                          >
                              <div className="flex justify-between items-start mb-6">
                                  <Badge className={cn(
                                      "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border-0",
                                      activeInsight === insight.id ? "bg-white text-blue-600" : "bg-blue-500/10 text-blue-500"
                                  )}>
                                      {insight.label}
                                  </Badge>
                                  {insight.trend && (
                                      <div className={cn("text-[10px] font-bold", activeInsight === insight.id ? "text-white" : "text-green-500")}>
                                          {insight.trend} <TrendingUp className="inline h-3 w-3" />
                                      </div>
                                  )}
                              </div>
                              <p className={cn("text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-2", activeInsight === insight.id ? "text-white" : "text-zinc-200")}>
                                  {insight.stat}
                              </p>
                              <p className={cn("text-xs font-medium leading-relaxed", activeInsight === insight.id ? "text-white/70" : "text-zinc-500")}>
                                  {insight.desc}
                              </p>
                          </div>
                      ))}
                      <div className="p-5 sm:p-6 md:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-zinc-950 border border-white/5 flex flex-col justify-center items-center text-center group hover:border-blue-500/30 transition-all border-dashed text-zinc-500">
                          <Cpu className="h-8 w-8 text-zinc-700 group-hover:text-blue-500 transition-colors mb-4" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Market Insights</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 2. DISCOVERY GRID */}
      <div className="flex-1 container mx-auto px-5 sm:px-6 max-w-[1600px] py-16 sm:py-20">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 sm:mb-16 border-b border-white/5 pb-8 sm:pb-10">
                <div>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2">Search Results</p>
                    <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-white">Market Feed</h2>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-bold text-zinc-500">
                    <span className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                      {showingSample
                        ? `Sample listings (${showingCount})`
                        : totalProjects > 0
                          ? `Showing ${showingCount} of ${totalProjects}`
                          : 'Inventory not connected yet'}
                    </span>
                    <div className="hidden sm:block w-px h-4 bg-white/10" />
                    <span>{showingSample ? 'Example feed' : `Loaded ${showingCount} of ${totalProjects}`}</span>
                </div>
            </div>

            {!loading && totalProjects === 0 && !showingSample && (
                <div className="mb-12 rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-8 text-center space-y-4">
                    <p className="text-lg font-semibold text-white">No inventory connected yet.</p>
                    <p className="text-sm text-zinc-500">Add your listings source or preview with sample listings.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild className="h-12 px-6 rounded-full bg-white text-black font-bold">
                            <a href="/docs#inventory">Add listings source</a>
                        </Button>
                        <Button onClick={handleLoadSample} variant="outline" className="h-12 px-6 rounded-full border-white/10 bg-white/5 text-white font-bold">
                            Add sample listings
                        </Button>
                    </div>
                </div>
            )}

            {loading && projects.length === 0 ? (
                <div className="h-96 flex flex-col items-center justify-center gap-6">
                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                    <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Loading listings...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                    {projects.map((project) => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            onClick={() => handleProjectClick(project.id)} 
                        />
                    ))}
                </div>
            )}

            {!loading && canLoadMore && (
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        className="h-11 sm:h-12 px-6 rounded-full bg-white text-black font-bold"
                        disabled={loading}
                        onClick={() => fetchProjects(page + 1, { append: true })}
                    >
                        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                        Load 12 More
                    </Button>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Page {page} of {totalPages}
                    </span>
                </div>
            )}
      </div>

      {/* 3. FOOTER TRUST */}
      <section className="py-16 sm:py-20 border-t border-white/5 bg-zinc-950">
          <div className="container mx-auto px-5 sm:px-6 max-w-[1600px]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 text-zinc-400">
                  <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 shrink-0"><ShieldCheck className="h-6 w-6" /></div>
                      <div>
                          <h4 className="font-bold text-white mb-1 uppercase tracking-widest text-xs">Curated Listings</h4>
                          <p className="text-xs leading-relaxed">Listings are sourced from your inventory feed and reviewed for clarity.</p>
                      </div>
                  </div>
                   <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 shrink-0"><Globe className="h-6 w-6" /></div>
                      <div>
                          <h4 className="font-bold text-white mb-1 uppercase tracking-widest text-xs">Market Coverage</h4>
                          <p className="text-xs leading-relaxed">Track areas your team focuses on with consistent formatting.</p>
                      </div>
                  </div>
                   <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 shrink-0"><Zap className="h-6 w-6" /></div>
                      <div>
                          <h4 className="font-bold text-white mb-1 uppercase tracking-widest text-xs">Ready to Share</h4>
                          <p className="text-xs leading-relaxed">Turn listings into shareable links and quick follow-ups.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

    </main>
  );
}

interface ProjectCardProps {
  project: ProjectData;
  onClick: () => void;
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  const developerLabel = project.developer || 'Developer not shared';
  const priceLabel = project.price?.label || 'Price on request';
  const roiValue = project.performance?.roi;
  const roiLabel = roiValue ? `${roiValue}%` : 'Not shared';
  const appreciationValue = project.performance?.capitalAppreciation;
  const appreciationLabel = appreciationValue ? `${appreciationValue}%` : 'Not shared';
  const accent = pickAccent(project.id || project.name);

  return (
    <Card 
      onClick={onClick}
      className="bg-zinc-900/60 border overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-700 group cursor-pointer"
      style={{
        borderColor: accent.stroke,
        boxShadow: `0 0 0 1px ${accent.stroke}, 0 25px 60px ${accent.glow}`,
      }}
    >
      <div className="h-40 sm:h-48 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${accent.bg}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_55%)] opacity-60" />
        <div className="absolute inset-0 border border-white/5 rounded-[2rem] sm:rounded-[2.5rem]" />
        <div className="relative p-4 sm:p-6 h-full flex flex-col justify-end">
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            {project.location?.area || project.location?.city || 'UAE'}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white italic uppercase tracking-tighter mt-2">{project.name}</h3>
          <p className="text-zinc-400 font-medium text-xs sm:text-sm flex items-center gap-2">
            <Building className="h-4 w-4" />
            {developerLabel}
          </p>
        </div>
      </div>
      <CardContent className="p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
            <div>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Price</p>
                <p className="text-base sm:text-lg font-black text-white tracking-tighter">{priceLabel}</p>
            </div>
            <div>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Return</p>
                <p className="text-base sm:text-lg font-black text-green-500">{roiLabel}</p>
            </div>
            <div>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Appreciation</p>
                <p className="text-base sm:text-lg font-black text-green-500">{appreciationLabel}</p>
            </div>
        </div>
        <Button variant="outline" className="w-full h-11 sm:h-12 rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:text-white font-bold gap-2 text-[10px] sm:text-xs uppercase tracking-widest">
            View Full Details <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

const ACCENTS = [
  {
    stroke: 'rgba(59, 130, 246, 0.45)',
    glow: 'rgba(59, 130, 246, 0.15)',
    bg: 'from-blue-600/25 via-blue-600/10 to-transparent',
  },
  {
    stroke: 'rgba(16, 185, 129, 0.45)',
    glow: 'rgba(16, 185, 129, 0.15)',
    bg: 'from-emerald-500/25 via-emerald-500/10 to-transparent',
  },
  {
    stroke: 'rgba(245, 158, 11, 0.45)',
    glow: 'rgba(245, 158, 11, 0.15)',
    bg: 'from-amber-500/25 via-amber-500/10 to-transparent',
  },
  {
    stroke: 'rgba(236, 72, 153, 0.45)',
    glow: 'rgba(236, 72, 153, 0.15)',
    bg: 'from-pink-500/25 via-pink-500/10 to-transparent',
  },
  {
    stroke: 'rgba(139, 92, 246, 0.45)',
    glow: 'rgba(139, 92, 246, 0.15)',
    bg: 'from-violet-500/25 via-violet-500/10 to-transparent',
  },
];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 2147483647;
  }
  return hash;
}

function pickAccent(seed: string) {
  const index = hashString(seed || 'entrestate') % ACCENTS.length;
  return ACCENTS[index];
}
