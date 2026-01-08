'use client';

import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  MapPin, 
  Building2, 
  ArrowUpRight, 
  BarChart3, 
  Calendar,
  Zap,
  Share2,
  FileText,
  X,
  Navigation
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectData } from "@/lib/types";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface ProjectCardProps {
  project: ProjectData;
  index?: number;
}

// The default placeholder used in ingestion
const DEFAULT_INGEST_IMAGE = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800";
// A high-quality dark map texture for the fallback
const MAP_TEXTURE_IMAGE = "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200";

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const statusLabel = project.availability ?? project.status ?? 'Active';
  
  // Determine if we should show the real image or the map fallback
  const hasRealImage = Array.isArray(project.images) && 
                       project.images.length > 0 && 
                       project.images[0] !== DEFAULT_INGEST_IMAGE;
                       
  const displayImage = hasRealImage ? project.images[0] : MAP_TEXTURE_IMAGE;

  const capitalGainValue = project.performance?.capitalAppreciation && project.performance.capitalAppreciation > 0
    ? project.performance.capitalAppreciation
    : null;
  const capitalGainLabel = capitalGainValue ? `+${capitalGainValue}%` : 'Not shared';
  const roiValue = project.performance?.roi;
  const roiLabel = roiValue ? `${roiValue}%` : 'Not shared';
  const handoverLabel = project.handover ? `Q${project.handover.quarter} ${project.handover.year}` : 'TBD';
  const marketCity = project.location?.city ?? 'local';
  const marketSummary = project.performance?.marketTrend
    ? project.performance.marketTrend === 'up'
      ? `This project is tracking ahead of the ${marketCity} market index this quarter.`
      : project.performance.marketTrend === 'down'
        ? `This project is tracking below the ${marketCity} market index this quarter.`
        : `This project is tracking with the ${marketCity} market index this quarter.`
    : 'Market trend insights are not shared yet.';

  const developerName = project.developer
    ? project.developer === "Verified Developer"
      ? "Private Developer"
      : project.developer
    : "Developer not shared";

  const handleCreateLandingPage = () => {
    router.push(`/builder?prompt=Luxury landing page for ${project.name} by ${developerName} in ${project.location?.area}`);
  };

  const handleCopyLink = async () => {
    if (!project.id) return;
    const publicUrl = project.publicUrl;
    const url = publicUrl
      ? publicUrl.startsWith('http')
        ? publicUrl
        : `${window.location.origin}${publicUrl}`
      : `${window.location.origin}/discover/${project.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied", description: "Project link copied to clipboard." });
    } catch (error) {
      console.error('Failed to copy link', error);
    }
  };

  const brochureUrl = project.brochureUrl;

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group relative bg-zinc-900 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 flex flex-col h-full"
    >
        {/* Visual Top */}
        <div className="relative aspect-[16/10] overflow-hidden bg-zinc-800">
            <ResponsiveImage 
                src={displayImage} 
                alt={project.name ?? "Project Location"}
                fill
                className={cn(
                    "transition-transform duration-1000",
                    hasRealImage ? "group-hover:scale-105" : "grayscale opacity-60 group-hover:scale-110 group-hover:opacity-40"
                )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            
            {/* Map Pin Overlay for Non-Image Projects */}
            {!hasRealImage && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 group-hover:-translate-y-2 transition-transform duration-500">
                        <div className="relative">
                            <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute inset-0 opacity-75" />
                            <div className="w-4 h-4 bg-blue-500 rounded-full relative border-2 border-white shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
                        </div>
                        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                            <Navigation className="h-3 w-3 text-blue-500" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{project.location?.area || 'Prime Location'}</span>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="absolute top-6 left-6 flex gap-2">
                <Badge className="bg-white/10 backdrop-blur-xl border-white/10 text-white text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                    {statusLabel}
                </Badge>
                {project.performance?.marketTrend === 'up' && (
                    <Badge className="bg-green-500/20 backdrop-blur-xl border-green-500/20 text-green-500 text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full gap-1.5">
                        <TrendingUp className="h-3 w-3" /> High Demand
                    </Badge>
                )}
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="space-y-1.5 max-w-[65%]">
                    <div className="flex items-center gap-1.5 text-white/60 text-xs font-medium truncate">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" /> {project.location?.city}
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tighter leading-none truncate">{project.name}</h3>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Starting</p>
                    <p className="text-xl font-black text-white">{project.price?.label ?? 'Price on request'}</p>
                </div>
            </div>
        </div>

        {/* Intelligence Data Bottom */}
        <div className="p-8 space-y-8 flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-3 gap-4">
                <DataMetric 
                    label="Yield (ROI)" 
                    value={roiLabel} 
                    icon={BarChart3} 
                    color="blue"
                />
                <DataMetric 
                    label="Growth" 
                    value={capitalGainLabel} 
                    icon={ArrowUpRight} 
                    color="green"
                />
                <DataMetric 
                    label="Completion" 
                    value={handoverLabel} 
                    icon={Calendar} 
                    color="orange"
                />
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-zinc-500" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none mb-1.5">Developer</p>
                        <p className="text-sm font-bold text-zinc-300 leading-none truncate w-32">{developerName}</p>
                    </div>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-full border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] h-10 px-6 hover:bg-white hover:text-black transition-all">
                            View Data
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-4xl bg-zinc-950 border-white/10 text-white rounded-[2.5rem] overflow-hidden p-0 max-h-[90vh] overflow-y-auto custom-scrollbar border-none shadow-2xl">
                        <div className="relative aspect-video w-full bg-zinc-900">
                            <ResponsiveImage src={displayImage} alt={project.name ?? "Project"} fill className={cn("object-cover", !hasRealImage && "opacity-50 grayscale")} />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                            <div className="absolute top-6 right-6 z-50">
                                <DialogClose className="h-10 w-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-black transition-all">
                                    <X className="h-5 w-5" />
                                </DialogClose>
                            </div>
                            <div className="absolute bottom-10 left-10 right-10">
                                <DialogTitle className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-none uppercase italic">{project.name}</DialogTitle>
                                <DialogDescription className="text-xl text-zinc-400 font-light mt-4 flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-blue-500" /> {project.location?.area}, {project.location?.city}
                                </DialogDescription>
                            </div>
                        </div>

                        <div className="p-12 space-y-16">
                            {/* Actions Node */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Button 
                                    onClick={handleCreateLandingPage}
                                    className="h-20 rounded-[2rem] bg-blue-600 hover:bg-blue-700 text-white font-black gap-3 text-xl shadow-xl shadow-blue-600/20 group"
                                >
                                    <Zap className="h-6 w-6 text-blue-300 group-hover:scale-125 transition-transform" /> Create Landing Page
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-20 rounded-[2rem] border-white/10 bg-white/5 hover:bg-white/10 font-bold gap-3 text-lg"
                                    onClick={handleCopyLink}
                                >
                                    <Share2 className="h-5 w-5" /> Copy Link
                                </Button>
                                {brochureUrl ? (
                                    <Button
                                      variant="outline"
                                      className="h-20 rounded-[2rem] border-white/10 bg-white/5 hover:bg-white/10 font-bold gap-3 text-lg"
                                      asChild
                                    >
                                      <a href={brochureUrl} target="_blank" rel="noopener noreferrer">
                                        <FileText className="h-5 w-5" /> Project PDF
                                      </a>
                                    </Button>
                                ) : (
                                    <Button variant="outline" className="h-20 rounded-[2rem] border-white/10 bg-white/5 font-bold gap-3 text-lg" disabled>
                                        <FileText className="h-5 w-5" /> PDF not shared
                                    </Button>
                                )}
                            </div>

                            <div className="grid lg:grid-cols-2 gap-16">
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Project Overview</h4>
                                        <p className="text-zinc-300 leading-relaxed text-xl font-light">
                                            {project.description?.full || project.description?.short || 'Details coming soon.'}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="p-8 rounded-[2rem] bg-zinc-900 border border-white/5">
                                            <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2 tracking-widest">Expected Yield</p>
                                        <p className="text-4xl font-black text-green-500">
                                          {roiLabel}
                                          {roiValue && <span className="text-xs font-medium opacity-50 ml-1">PA</span>}
                                        </p>
                                        </div>
                                        <div className="p-8 rounded-[2rem] bg-zinc-900 border border-white/5">
                                            <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2 tracking-widest">Growth Potential</p>
                                            <p className="text-4xl font-black text-blue-500">{capitalGainLabel}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-10">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Market Performance</h4>
                                    <div className="h-64 flex items-end gap-3 px-4 bg-black/40 rounded-[2.5rem] border border-white/5 pt-12 pb-6">
                                        {(project.performance?.priceHistory || [{year: 2023, avgPrice: 10}, {year: 2024, avgPrice: 12}, {year: 2025, avgPrice: 14}]).map((h, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group">
                                                <div className="relative w-full h-full flex items-end">
                                                    <motion.div 
                                                        initial={{ height: 0 }}
                                                        whileInView={{ height: `${(h.avgPrice / Math.max(...(project.performance?.priceHistory || [{avgPrice: 15}]).map(ph => ph.avgPrice))) * 80}%` }}
                                                        transition={{ duration: 1, delay: i * 0.1 }}
                                                        className="bg-blue-600/40 w-full rounded-t-xl group-hover:bg-blue-500 transition-all border-t border-blue-400" 
                                                    />
                                                </div>
                                                <p className="text-[10px] font-mono text-zinc-600 group-hover:text-white transition-colors">{h.year}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-8 rounded-[2.5rem] bg-blue-600/5 border border-blue-500/20 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <TrendingUp className="h-20 w-20 text-blue-500" />
                                        </div>
                                        <div className="flex items-center gap-3 mb-3 relative z-10">
                                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                            <p className="font-black uppercase tracking-widest text-xs text-white">Sentiment: {project.performance?.marketTrend === 'up' ? 'Aggressive' : 'Stable'}</p>
                                        </div>
                                        <p className="text-sm text-zinc-400 leading-relaxed font-light relative z-10">{marketSummary}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Project DNA */}
                            <div className="space-y-8">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Project DNA</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <DnaTag label="Developer" value={developerName} />
                                    <DnaTag label="Handover" value={project.handover ? `Q${project.handover.quarter} ${project.handover.year}` : 'TBD'} />
                                    <DnaTag label="Price Range" value={project.price?.label ?? 'N/A'} />
                                    <DnaTag label="Status" value={statusLabel} />
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    </motion.div>
  );
}

function DnaTag({ label, value }: { label: string, value: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-[8px] font-black text-zinc-600 uppercase mb-1.5 tracking-widest">{label}</p>
            <p className="text-sm font-bold text-white truncate" title={value}>{value}</p>
        </div>
    )
}

function DataMetric({ label, value, icon: Icon, color }: any) {
    const colorClasses: any = {
        blue: "text-blue-500 bg-blue-500/10",
        green: "text-green-500 bg-green-500/10",
        orange: "text-orange-500 bg-orange-500/10"
    };

    return (
        <div className="space-y-3">
            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", colorClasses[color])}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none mb-1.5">{label}</p>
                <p className="text-lg font-black text-white leading-none tracking-tight">{value}</p>
            </div>
        </div>
    )
}
