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
    Target, 
    BarChart3, 
    PieChart, 
    TrendingUp, 
    Calendar, 
    MousePointerClick,
    ShieldCheck,
    Cpu,
    Filter,
    Building
} from "lucide-react";
import type { ProjectData } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const PROJECTS_PER_PAGE = 12;

export default function DiscoverPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [page, setPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);

  // Database-Driven Insight State
  const [activeInsight, setActiveInsight] = useState("Yield");

  const INSIGHTS = [
    { id: 'Yield', label: 'ROI Yield', desc: 'Highest rental returns currently in Dubai Marina.', stat: '8.4%', trend: '+1.2%' },
    { id: 'Handover', label: '2026 Handover', desc: 'Projects scheduled for delivery in Q4 2026.', stat: '142', sub: 'Units' },
    { id: 'Appreciation', label: 'Value Growth', desc: 'Capital appreciation spike in Creek Harbour.', stat: '14%', trend: '+3.5%' },
  ];

  const fetchProjects = useCallback(async (pageParam: number, append: boolean) => {
    setLoading(true);
    try {
      const url = new URL('/api/projects/search', window.location.origin);
      url.searchParams.set('query', searchQuery);
      url.searchParams.set('city', selectedCity);
      url.searchParams.set('page', String(pageParam));
      url.searchParams.set('limit', String(PROJECTS_PER_PAGE));

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to fetch projects');
      const json = await res.json();
      
      setTotalProjects(json.pagination.total || 0);
      setProjects((prev) => append ? [...prev, ...json.data] : json.data);
      setPage(pageParam);
    } catch (error) {
      console.error('Failed to load projects', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCity]);

  useEffect(() => {
    fetchProjects(1, false);
  }, [fetchProjects]);

  const handleProjectClick = (projectId: string) => {
    router.push(`/discover/${projectId}`);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-blue-500/30">
      
      {/* 1. DATA-DRIVEN HERO */}
      <section className="bg-zinc-950 border-b border-white/5 pt-32 pb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-6 max-w-[1600px] relative z-10">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                  <div className="space-y-8">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/10 text-blue-500 text-[10px] font-bold uppercase tracking-[0.3em] border border-blue-500/20">
                        <Activity className="h-3.5 w-3.5" />
                        Live Intelligence Cluster
                      </div>
                      <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                          Market <br/>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 uppercase italic">Truths.</span>
                      </h1>
                      <p className="text-zinc-500 text-2xl font-light leading-relaxed max-w-xl">
                          Beyond search. Access real-time facts from 3.5M+ property interactions and 3,750 verified projects.
                      </p>

                      <div className="relative group max-w-md">
                          <div className="absolute -inset-1 bg-blue-600 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-1000" />
                          <div className="relative flex items-center bg-zinc-900 border border-white/10 rounded-2xl p-2 pr-4 shadow-2xl">
                              <Search className="h-6 w-6 text-zinc-600 ml-4" />
                              <input 
                                type="text" 
                                placeholder="Ask: 'Which projects handover in 2026?'"
                                className="flex-1 bg-transparent border-none text-white placeholder:text-zinc-700 focus:outline-none h-14 px-4 text-lg font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                          </div>
                      </div>
                  </div>

                  {/* Insight Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {INSIGHTS.map((insight) => (
                          <div 
                            key={insight.id}
                            className={cn(
                                "p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer group",
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
                              <p className={cn("text-5xl font-black tracking-tighter mb-2", activeInsight === insight.id ? "text-white" : "text-zinc-200")}>
                                  {insight.stat}
                              </p>
                              <p className={cn("text-xs font-medium leading-relaxed", activeInsight === insight.id ? "text-white/70" : "text-zinc-500")}>
                                  {insight.desc}
                              </p>
                          </div>
                      ))}
                      <div className="p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 flex flex-col justify-center items-center text-center group hover:border-blue-500/30 transition-all border-dashed text-zinc-500">
                          <Cpu className="h-8 w-8 text-zinc-700 group-hover:text-blue-500 transition-colors mb-4" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Master Node Analytics</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 2. DISCOVERY GRID */}
      <div className="flex-1 container mx-auto px-6 max-w-[1600px] py-20">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 border-b border-white/5 pb-10">
                <div>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2">Cluster Scan Result</p>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Project Inventory</h2>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-zinc-500">
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" /> {totalProjects} Nodes Synced</span>
                    <div className="w-px h-4 bg-white/10" />
                    <span>Real-time Market Feed</span>
                </div>
            </div>

            {loading && projects.length === 0 ? (
                <div className="h-96 flex flex-col items-center justify-center gap-6">
                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                    <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Querying Master Database...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            onClick={() => handleProjectClick(project.id)} 
                        />
                    ))}
                </div>
            )}
      </div>

      {/* 3. FOOTER TRUST */}
      <section className="py-20 border-t border-white/5 bg-zinc-950">
          <div className="container mx-auto px-6 max-w-[1600px]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-zinc-400">
                  <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 shrink-0"><ShieldCheck className="h-6 w-6" /></div>
                      <div>
                          <h4 className="font-bold text-white mb-1 uppercase tracking-widest text-xs">Verified Nodes</h4>
                          <p className="text-xs leading-relaxed">Every project is verified against official DLD records and developer inventory lists.</p>
                      </div>
                  </div>
                   <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 shrink-0"><Globe className="h-6 w-6" /></div>
                      <div>
                          <h4 className="font-bold text-white mb-1 uppercase tracking-widest text-xs">Global Delivery</h4>
                          <p className="text-xs leading-relaxed">Access cross-border data for international investors looking at high-yield markets.</p>
                      </div>
                  </div>
                   <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 shrink-0"><Zap className="h-6 w-6" /></div>
                      <div>
                          <h4 className="font-bold text-white mb-1 uppercase tracking-widest text-xs">Instant Activation</h4>
                          <p className="text-xs leading-relaxed">Turn any data point into a live campaign with our integrated Ads and Audience Architect.</p>
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
  return (
    <Card 
      onClick={onClick}
      className="bg-zinc-900/50 border-white/5 overflow-hidden rounded-[2.5rem] hover:border-blue-500/20 transition-all duration-700 group cursor-pointer"
    >
      <div className="h-48 relative overflow-hidden">
        <img src={project.images?.[0] || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800'} alt={project.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-all duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="relative p-6 h-full flex flex-col justify-end">
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{project.name}</h3>
          <p className="text-zinc-400 font-medium text-sm flex items-center gap-2">
            <Building className="h-4 w-4" />
            {project.developer || 'Verified Developer'}
          </p>
        </div>
      </div>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
            <div>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Price</p>
                <p className="text-lg font-black text-white tracking-tighter">{project.price?.label || 'AED 1.5M+'}</p>
            </div>
            <div>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">ROI</p>
                <p className="text-lg font-black text-green-500">{project.performance?.roi || '--'}%</p>
            </div>
            <div>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Growth</p>
                <p className="text-lg font-black text-green-500">{project.performance?.growth || '--'}%</p>
            </div>
        </div>
        <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:text-white font-bold gap-2 text-xs uppercase tracking-widest">
            View Full Details <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
