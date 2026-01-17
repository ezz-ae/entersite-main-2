'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2, Activity, MapPin } from "lucide-react";
import type { ProjectData, InventoryCta } from '@/lib/types';
import { ProjectCard } from '@/components/project-card';

interface Props {
  initialProjects: ProjectData[];
}

const PROJECTS_PER_PAGE = 25;
type InventoryItem = ProjectData | InventoryCta;

const buildQueryString = (params: Record<string, string | number | undefined>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  });
  return search.toString();
};

export function ProjectDiscoveryClient({ initialProjects }: Props) {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('all');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<InventoryItem[]>(initialProjects.slice(0, PROJECTS_PER_PAGE));
  const [totalResults, setTotalResults] = useState(initialProjects.length);
  const [page, setPage] = useState(1);
  const [cityOptions, setCityOptions] = useState<string[]>(['Dubai', 'Abu Dhabi', 'Sharjah']);

  const mergeProjects = (existing: InventoryItem[], incoming: InventoryItem[]) => {
    const merged: InventoryItem[] = [];
    const seen = new Set<string>();
    [...existing, ...incoming].forEach((item) => {
      if (!item?.id) {
        merged.push(item);
        return;
      }
      if (seen.has(item.id)) return;
      seen.add(item.id);
      merged.push(item);
    });
    return merged;
  };

  const fetchProjects = async (
    nextPage = 1,
    overrides?: { query?: string; city?: string; status?: string; append?: boolean }
  ) => {
    setLoading(true);
    try {
      const queryValue = overrides?.query ?? query;
      const cityValue = overrides?.city ?? city;
      const statusValue = overrides?.status ?? status;
      const append = overrides?.append ?? false;
      const qs = buildQueryString({
        query: queryValue,
        city: cityValue,
        status: statusValue,
        page: nextPage,
        limit: PROJECTS_PER_PAGE,
      });
      const res = await fetch(`/api/projects/search?${qs}`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      const json = await res.json();
      const nextProjects = json.data || [];
      const total = json.pagination?.total || 0;
      const isDefaultFilters = !queryValue && cityValue === 'all' && statusValue === 'all';
      if (!append && !nextProjects.length && total === 0 && isDefaultFilters && initialProjects.length) {
        setProjects(initialProjects.slice(0, PROJECTS_PER_PAGE));
        setTotalResults(initialProjects.length);
        setPage(1);
        return;
      }
      setProjects((prev) => (append ? mergeProjects(prev, nextProjects) : nextProjects));
      setTotalResults(total);
      setPage(nextPage);
    } catch (error) {
      console.error('Failed to fetch discovery projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, status]);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const res = await fetch('/api/projects/meta', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const cities = Array.isArray(data.locations)
          ? data.locations.map((item: { city: string }) => item.city).filter(Boolean)
          : [];
        if (cities.length) {
          setCityOptions(cities);
        }
      } catch (error) {
        console.error('Failed to load project metadata', error);
      }
    };
    loadMeta();
  }, []);

  const handleSearch = () => {
    const nextQuery = query.trim();
    setQuery(nextQuery);
    fetchProjects(1, { query: nextQuery });
  };

  const totalPages = Math.max(1, Math.ceil(totalResults / PROJECTS_PER_PAGE));
  const projectCount = projects.filter((item) => !isInventoryCta(item)).length;
  const canLoadMore = projectCount < totalResults;

  return (
    <section className="bg-black text-white py-16 sm:py-24 md:py-32 border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-5 sm:px-6 max-w-[1800px] relative z-10">
        
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 sm:mb-16 md:mb-24 gap-10 border-b border-white/5 pb-8 sm:pb-10 md:pb-16">
            <div className="max-w-4xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
                    <Activity className="h-3 w-3" /> Market Feed
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter leading-none">
                    Market <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Insights.</span>
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl font-light">
                    Browse curated project listings with pricing, handover windows, and key amenities.
                </p>
            </div>
            <div className="flex gap-4">
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase">Inventory Status</p>
                        <p className="text-xs font-mono text-green-500">Pilot</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="mb-12 sm:mb-16 md:mb-20">
            <div className="bg-zinc-900/50 backdrop-blur-3xl border border-white/10 p-2 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col lg:flex-row gap-2 max-w-6xl mx-auto shadow-2xl">
                <div className="flex-1 flex items-center px-4 sm:px-6 gap-3 sm:gap-4 border-b lg:border-b-0 lg:border-r border-white/5 py-4 lg:py-0">
                    <Search className="h-5 w-5 text-zinc-600" />
                    <input 
                        type="text" 
                        placeholder="Search projects, developers, or areas..."
                        className="bg-transparent border-0 focus:ring-0 text-white placeholder:text-zinc-700 w-full text-base sm:text-lg font-medium"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 p-2">
                    <Select onValueChange={setCity} defaultValue="all">
                        <SelectTrigger className="h-12 sm:h-14 rounded-2xl bg-white/5 border-white/5 text-zinc-300 w-full sm:w-40 hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-[10px]">
                            <SelectValue placeholder="City" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10 text-white">
                            <SelectItem value="all">All Cities</SelectItem>
                            {cityOptions.map((cityName) => (
                              <SelectItem key={cityName} value={cityName}>
                                {cityName}
                              </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={setStatus} defaultValue="all">
                        <SelectTrigger className="h-12 sm:h-14 rounded-2xl bg-white/5 border-white/5 text-zinc-300 w-full sm:w-40 hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-[10px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10 text-white">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Sold Out">Sold Out</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={handleSearch} className="h-12 sm:h-14 px-6 sm:px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-900/40 w-full sm:w-auto">
                        Search Listings
                    </Button>
                </div>
            </div>
        </div>

        {loading && projects.length === 0 ? (
            <div className="h-[600px] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                    <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
                </div>
                <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">Searching listings...</p>
            </div>
        ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {projects.map((project, index) => (
                  isInventoryCta(project) ? (
                    <InventoryCtaCard key={project.id || `cta-${index}`} cta={project} />
                  ) : (
                    <ProjectCard key={project.id || index} project={project} />
                  )
                ))}
            </div>
        ) : (
            <div className="h-60 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[2.5rem] sm:rounded-[3rem] bg-white/5">
                <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-zinc-800 mb-4" />
                <p className="text-zinc-500 font-medium text-base sm:text-lg">No matches found in the current inventory.</p>
                <button
                  onClick={() => {
                    setQuery('');
                    setCity('all');
                    setStatus('all');
                    fetchProjects(1, { query: '', city: 'all', status: 'all' });
                  }}
                  className="mt-4 text-blue-500 font-bold uppercase tracking-widest text-[10px] hover:underline"
                >
                  Reset Filters
                </button>
            </div>
        )}

        {!loading && totalResults > PROJECTS_PER_PAGE && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Showing {projectCount} of {totalResults}
            </span>
            <Button
              className="h-12 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
              disabled={page >= totalPages || !canLoadMore}
              onClick={() => fetchProjects(page + 1, { append: true })}
            >
              Load {PROJECTS_PER_PAGE} More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function isInventoryCta(item: InventoryItem): item is InventoryCta {
  return (item as InventoryCta).type === 'inventory-cta';
}

function InventoryCtaCard({ cta }: { cta: InventoryCta }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-600/25 via-blue-950/20 to-transparent p-6 sm:p-8 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%)] opacity-80" />
      <div className="relative space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-blue-200">
          Market data
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{cta.title}</h3>
          <p className="text-sm sm:text-base text-zinc-300 mt-2">{cta.subtitle}</p>
        </div>
        <Button asChild className="h-11 sm:h-12 rounded-full bg-white text-black font-bold">
          <a href={cta.ctaHref}>{cta.ctaLabel}</a>
        </Button>
        {cta.description ? (
          <p className="text-xs text-zinc-400">{cta.description}</p>
        ) : null}
      </div>
    </div>
  );
}
