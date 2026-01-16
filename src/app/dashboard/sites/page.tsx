'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Edit, 
  Globe, 
  Target, 
  Users, 
  Plus, 
  Sparkles,
  Settings,
  Trash2,
  Copy,
  Loader2,
  UploadCloud,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { getUserSites } from '@/lib/firestore-service';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import type { SitePage } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { fetchSiteStats, type SiteStatsMap } from '@/lib/sites';
import { apiFetch } from '@/lib/apiFetch';

type RefinerMeta = {
  badgeLabel: string;
  badgeClassName: string;
  description: string;
  timeLabel: string;
  ctaLabel: string;
  ctaHref: string;
  ctaClassName: string;
};

const getRefinerMeta = (site: SitePage): RefinerMeta => {
  const status = site.refinerStatus;
  const baseHref = site.id ? `/builder?siteId=${site.id}` : '/builder';
  const reviewHref = `${baseHref}${baseHref.includes('?') ? '&' : '?'}variant=refined`;
  const lastRefinedDate = parseRefinerDate(site.lastRefinedAt);
  const timeDistance = lastRefinedDate ? formatDistanceToNow(lastRefinedDate, { addSuffix: true }) : '';

  if (status === 'review') {
    return {
      badgeLabel: 'Draft Ready',
      badgeClassName: 'bg-amber-500/15 text-amber-200 border border-amber-300/40',
      description: 'Review the Refiner polish and apply it to go live.',
      timeLabel: lastRefinedDate ? `Draft saved ${timeDistance}` : 'Awaiting review',
      ctaLabel: 'Review Draft',
      ctaHref: reviewHref,
      ctaClassName: 'border-amber-300 bg-amber-500/20 text-amber-50 hover:bg-amber-500/30'
    };
  }

  if (status === 'running' || status === 'queued') {
    return {
      badgeLabel: status === 'running' ? 'Refiner Running' : 'Refiner Queued',
      badgeClassName: 'bg-blue-500/10 text-blue-100 border border-blue-400/40',
      description: 'We are polishing this page now. You will be notified once a draft is ready.',
      timeLabel: lastRefinedDate ? `Last run ${timeDistance}` : 'First pass in progress',
      ctaLabel: 'View in Builder',
      ctaHref: baseHref,
      ctaClassName: 'border-blue-500 text-blue-100 bg-blue-500/10 hover:bg-blue-500/20'
    };
  }

  if (status === 'done') {
    return {
      badgeLabel: 'Refiner Applied',
      badgeClassName: 'bg-emerald-500/10 text-emerald-100 border border-emerald-400/30',
      description: 'Latest Refiner tweaks are already on this site. Run it again for a fresh pass anytime.',
      timeLabel: lastRefinedDate ? `Polished ${timeDistance}` : 'Up to date',
      ctaLabel: 'Run Again',
      ctaHref: baseHref,
      ctaClassName: ''
    };
  }

  return {
    badgeLabel: 'Refiner Available',
    badgeClassName: 'bg-white/5 text-zinc-200 border border-white/10',
    description: 'Run Refiner to tighten copy, spacing, and conversions before you launch.',
    timeLabel: 'Never refined',
    ctaLabel: 'Run Refiner',
    ctaHref: baseHref,
    ctaClassName: ''
  };
};

const parseRefinerDate = (value: SitePage['lastRefinedAt']): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof (value as any)?.toDate === 'function') {
    try {
      return (value as any).toDate();
    } catch {
      return null;
    }
  }
  return null;
};

export default function SitesDashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sites, setSites] = useState<SitePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [newSitePrompt, setNewSitePrompt] = useState('');
  const [siteStats, setSiteStats] = useState<SiteStatsMap>({});
  const [statsLoading, setStatsLoading] = useState(false);
  const [uploadTab, setUploadTab] = useState('text');

  useEffect(() => {
    async function loadSites() {
      if (user) {
        setLoading(true);
        try {
          const userSites = await getUserSites(user.uid);
          setSites(userSites as SitePage[]);
        } catch (error) {
          console.error("Failed to load sites:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    loadSites();
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      if (!user) return;
      const ids = sites.map((site) => site.id).filter((id): id is string => Boolean(id));
      if (ids.length === 0) {
        setSiteStats({});
        return;
      }
      setStatsLoading(true);
      try {
        const stats = await fetchSiteStats(ids);
        if (isMounted) {
          setSiteStats(stats);
        }
      } catch (error) {
        console.error('Failed to load site stats', error);
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    };
    loadStats();
    return () => {
      isMounted = false;
    };
  }, [sites, user]);

  const handleCreateSite = async () => {
    if (user && newSitePrompt) {
        // For now, we will use a hardcoded project ID.
        // In the future, we will create a project first.
        const projectId = "demo-project";
        const response = await apiFetch('/api/create/landing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectId,
                extractedText: newSitePrompt,
            }),
        });

        if (response.ok) {
            const { pageId } = await response.json();
            router.push(`/builder?siteId=${pageId}`);
        } else {
            console.error("Failed to create site");
        }
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiFetch('/api/upload/pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { text } = await response.json();
        setNewSitePrompt(text);
        setUploadTab('text'); // Switch back to the text tab to show the extracted text
      } else {
        console.error("Failed to upload PDF");
      }
    }
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white uppercase italic">Project Portfolio</h1>
          <p className="text-zinc-500 text-lg font-light">Manage your digital assets and their performance.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 gap-2 px-8 h-14 text-base font-bold">
                    <Plus className="h-5 w-5" /> Start New Project
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-zinc-950 border-white/10 text-white rounded-[2.5rem]">
                <DialogHeader className="p-4">
                    <DialogTitle className="text-3xl font-bold flex items-center gap-3">
                        <Sparkles className="h-8 w-8 text-blue-500" />
                        Site Architect
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 text-lg font-light mt-2">
                        Give Smart Builder a project brief. It will handle the sitemap, content, and data integration.
                    </DialogDescription>
                </DialogHeader>
                <div className="px-4">
                    <div className="flex space-x-2 rounded-lg bg-zinc-900 p-1">
                        <button
                            className={`w-full rounded-md py-2.5 text-sm font-medium leading-5 text-white ${uploadTab === 'text' ? 'bg-blue-600 shadow' : 'text-zinc-300 hover:bg-white/[0.12]'}`}
                            onClick={() => setUploadTab('text')}
                        >
                            Paste Text
                        </button>
                        <button
                            className={`w-full rounded-md py-2.5 text-sm font-medium leading-5 text-white ${uploadTab === 'pdf' ? 'bg-blue-600 shadow' : 'text-zinc-300 hover:bg-white/[0.12]'}`}
                            onClick={() => setUploadTab('pdf')}
                        >
                            Upload PDF
                        </button>
                    </div>
                </div>
                <div className="grid gap-6 py-8 px-4 text-left">
                  {uploadTab === 'text' ? (
                      <div className="grid gap-2">
                          <Label htmlFor="site-description" className="text-zinc-500 uppercase text-[10px] font-bold tracking-[0.2em]">Architect's Brief</Label>
                          <Textarea 
                              id="site-description" 
                              placeholder="Describe the project... (e.g., A luxury villa launch in Dubai South.)" 
                              className="bg-zinc-900 border-white/5 min-h-[120px] text-base rounded-xl resize-none text-white"
                              value={newSitePrompt}
                              onChange={(e) => setNewSitePrompt(e.target.value)}
                          />
                      </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-zinc-900 border-zinc-600 hover:border-zinc-500 hover:bg-zinc-800">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-4 text-zinc-500" />
                                <p className="mb-2 text-sm text-zinc-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-zinc-500">PDF (MAX. 5MB)</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                        </label>
                    </div> 
                  )}
                </div>
                <DialogFooter className="p-4 pt-0">
                    <Button type="submit" className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-2xl" onClick={handleCreateSite}>
                        Create Landing Page
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      {!loading && statsLoading && (
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Syncing site metrics...
          </div>
      )}

      {/* Sites List */}
      {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <p className="text-zinc-500">Loading your projects...</p>
          </div>
      ) : sites.length === 0 ? (
          <div className="h-64 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center gap-6 p-10 text-center">
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-zinc-700" />
              </div>
              <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">No Projects Found</h3>
                  <p className="text-zinc-500 max-w-sm">You haven't built any sites yet. Use the Smart Architect to create your first high-converting landing page.</p>
              </div>
              <Button variant="outline" className="rounded-full border-white/10" onClick={() => setIsModalOpen(true)}>
                  Open Site Architect
              </Button>
          </div>
      ) : (
          <div className="grid grid-cols-1 gap-6">
            {sites.map((site) => {
              const refinerMeta = getRefinerMeta(site);
              const stats = site.id ? siteStats[site.id] : undefined;
              const views = stats?.views ?? 0;
              const leads = stats?.leads ?? 0;
              const conversionRate = leads > 0 && views > 0 ? (leads / views) * 100 : 0;
              const conversionLabel = conversionRate > 0 ? `${conversionRate.toFixed(1)}%` : '—';
              return (
              <Card key={site.id} className="overflow-hidden border-white/5 bg-zinc-900/50 backdrop-blur-3xl hover:border-blue-500/30 transition-all duration-500 rounded-[2.5rem]">
                <div className="flex flex-col lg:flex-row">
                    <div className={`w-full lg:w-80 h-48 lg:h-auto bg-gradient-to-br from-blue-900 to-indigo-900 relative flex-shrink-0 group overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <Link href={`/p/${site.id}`} target="_blank">
                                <Button variant="secondary" className="rounded-full font-bold shadow-lg h-12 px-8">
                                    View Site
                                </Button>
                            </Link>
                        </div>
                        <div className="absolute top-4 left-4">
                            <Badge className={cn(
                                "border-0 shadow-lg text-white font-bold px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest bg-green-600"
                            )}>
                                Live
                            </Badge>
                        </div>
                    </div>

                    <CardContent className="p-10 flex-grow flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-3xl font-bold mb-2 text-white">{site.title}</h3>
                                <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
                                    <Link href={`/p/${site.id}`} target="_blank" className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors">
                                        <Globe className="h-4 w-4" /> entrestate.com/p/{site.id}
                                    </Link>
                                    <span className="opacity-20">|</span>
                                    <span>Updated recently</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-12">
                                 <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Views</p>
                                    <p className="text-2xl font-black text-white">{views.toLocaleString()}</p>
                                    <p className="text-xs text-zinc-500">All-time interactions</p>
                                </div>
                                 <div className="space-y-1 border-l border-white/5 pl-12">
                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Leads</p>
                                    <p className="text-2xl font-black text-blue-500">{leads.toLocaleString()}</p>
                                    <p className="text-xs text-zinc-500">Conversion {conversionLabel}</p>
                                </div>
                                <div className="space-y-2 border-l border-white/5 pl-12 min-w-[220px]">
                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Refiner</p>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Badge className={cn("text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1 rounded-full border", refinerMeta.badgeClassName)}>
                                            {refinerMeta.badgeLabel}
                                        </Badge>
                                        <span className="text-xs text-zinc-500">{refinerMeta.timeLabel}</span>
                                    </div>
                                    <p className="text-xs text-zinc-500 max-w-xs">{refinerMeta.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <Link href={`/builder?siteId=${site.id}`}>
                                <Button variant="outline" className="h-11 rounded-full gap-2 border-white/10 bg-white/5 text-zinc-400 hover:text-white transition-all px-6 font-bold text-xs uppercase tracking-widest">
                                    <Edit className="h-4 w-4" /> Edit
                                </Button>
                            </Link>
                            
                            <Link href="/dashboard/google-ads">
                                <Button variant="outline" className={cn(
                                    "h-11 rounded-full gap-2 border-white/10 transition-all px-6 font-bold text-xs uppercase tracking-widest bg-white/5 text-zinc-400 hover:text-white"
                                )}>
                                    <Target className="h-4 w-4" /> 
                                    Launch Ads
                                </Button>
                            </Link>

                            <Link href={refinerMeta.ctaHref}>
                                <Button variant="outline" className={cn(
                                    "h-11 rounded-full gap-2 border-white/10 transition-all px-6 font-bold text-xs uppercase tracking-widest bg-white/5 text-zinc-100 hover:text-white",
                                    refinerMeta.ctaClassName
                                )}>
                                    <Sparkles className="h-4 w-4" />
                                    {refinerMeta.ctaLabel}
                                </Button>
                            </Link>
                            
                            <div className="w-px h-10 bg-white/5 hidden lg:block mx-2" />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full border border-white/5 bg-white/5 text-zinc-500">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 bg-zinc-950 border-white/10 text-white rounded-2xl p-2 shadow-2xl">
                                    <DropdownMenuLabel className="px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">Management</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/5" />
                                    <DropdownMenuItem className="gap-3 cursor-pointer py-3 rounded-xl hover:bg-white/5">
                                        <Copy className="h-4 w-4 text-zinc-500" /> Duplicate Build
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-3 cursor-pointer py-3 rounded-xl hover:bg-white/5">
                                        <Settings className="h-4 w-4 text-zinc-500" /> Domain & SEO
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/5" />
                                    <DropdownMenuItem className="gap-3 text-red-500 hover:bg-red-500/10 cursor-pointer py-3 rounded-xl">
                                        <Trash2 className="h-4 w-4" /> Delete Site
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardContent>
                </div>
              </Card>
              );
            })}
          </div>
      )}

      <div className="p-10 rounded-[3rem] bg-blue-600/5 border border-dashed border-blue-500/20 text-center flex items-center justify-center gap-4">
          <Sparkles className="h-6 w-6 text-blue-500" />
          <p className="text-zinc-300 font-medium text-lg">
            Active Meta Lead Gen campaigns capture <span className="text-white font-bold">3.5x more</span> qualified investor data.
          </p>
      </div>
    </div>
  );
}
