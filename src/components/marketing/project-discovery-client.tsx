'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2, Activity, MapPin } from "lucide-react";
import type { ProjectData } from '@/lib/types';
import { ProjectCard } from '@/components/project-card';

interface Props {
  initialProjects: ProjectData[];
}

const PROJECTS_PER_PAGE = 12;

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
  const [projects, setProjects] = useState<ProjectData[]>(initialProjects.slice(0, PROJECTS_PER_PAGE));
  const [totalResults, setTotalResults] = useState(initialProjects.length);
  const [page, setPage] = useState(1);
  const [cityOptions, setCityOptions] = useState<string[]>(['Dubai', 'Abu Dhabi', 'Sharjah']);

  const mergeProjects = (existing: ProjectData[], incoming: ProjectData[]) => {
    const map = new Map<string, ProjectData>();
    existing.forEach((project) => {
      if (project.id) {
        map.set(project.id, project);
      }
    });
    incoming.forEach((project) => {
      if (project.id) {
        map.set(project.id, project);
      }
    });
    const fallback = existing.filter((project) => !project.id);
    const merged = Array.from(map.values());
    return fallback.length ? [...fallback, ...merged] : merged;
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
      setProjects((prev) => (append ? mergeProjects(prev, nextProjects) : nextProjects));
      setTotalResults(json.pagination?.total || 0);
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
  const canLoadMore = projects.length < totalResults;

  return (
    <section className="bg-black text-white py-40 border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-[1800px] relative z-10">
        
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12 border-b border-white/5 pb-16">
            <div className="max-w-4xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-widest">
                    <Activity className="h-3 w-3" /> Market Feed
                </div>
                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none">
                    Market <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Insights.</span>
                </h2>
                <p className="text-2xl text-zinc-400 max-w-2xl font-light">
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

        <div className="mb-20">
            <div className="bg-zinc-900/50 backdrop-blur-3xl border border-white/10 p-2 rounded-[2.5rem] flex flex-col lg:flex-row gap-2 max-w-6xl mx-auto shadow-2xl">
                <div className="flex-1 flex items-center px-6 gap-4 border-b lg:border-b-0 lg:border-r border-white/5 py-4 lg:py-0">
                    <Search className="h-5 w-5 text-zinc-600" />
                    <input 
                        type="text" 
                        placeholder="Search projects, developers, or areas..."
                        className="bg-transparent border-0 focus:ring-0 text-white placeholder:text-zinc-700 w-full text-lg font-medium"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 p-2">
                    <Select onValueChange={setCity} defaultValue="all">
                        <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/5 text-zinc-300 w-full sm:w-40 hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-[10px]">
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
                        <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/5 text-zinc-300 w-full sm:w-40 hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-[10px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10 text-white">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Sold Out">Sold Out</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={handleSearch} className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-900/40">
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
                    <ProjectCard key={project.id || index} project={project} />
                ))}
            </div>
        ) : (
            <div className="h-60 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[3rem] bg-white/5">
                <MapPin className="h-10 w-10 text-zinc-800 mb-4" />
                <p className="text-zinc-500 font-medium text-lg">No matches found in the current inventory.</p>
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
              Showing {projects.length} of {totalResults}
            </span>
            <Button
              className="h-12 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
              disabled={page >= totalPages || !canLoadMore}
              onClick={() => fetchProjects(page + 1, { append: true })}
            >
              Load 12 More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
