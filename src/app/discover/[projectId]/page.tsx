'use client';

import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useParams } from 'next/navigation';
import { ProjectData } from '@/lib/types';
import { 
    Loader2, 
    Building, 
    MapPin, 
    DollarSign, 
    TrendingUp, 
    Calendar, 
    BarChart, 
    CheckCircle2, 
    Globe,
    Home
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

const ProjectDetailPage: NextPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (value?: string) => {
    if (!value) return 'Not shared';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Not shared';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatPrice = (value?: number) => {
    if (!value || Number.isNaN(value)) return 'Price on request';
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      setLoading(true);
      try {
        const resolvedId = Array.isArray(projectId) ? projectId[0] : projectId;
        const encodedId = encodeURIComponent(resolvedId);
        const res = await fetch(`/api/projects/${encodedId}`, { cache: 'no-store' });
        if (!res.ok) {
          setProject(null);
          return;
        }
        const data = await res.json();
        setProject(data.data as ProjectData);
      } catch (error) {
        console.error("Error fetching project:", error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <p>Project not found.</p>
      </div>
    );
  }

  const priceLabel = project.price?.label ?? 'Price on request';
  const roiLabel = project.performance?.roi ? `${project.performance.roi}%` : 'Not shared';
  const appreciationLabel = project.performance?.capitalAppreciation
    ? `${project.performance.capitalAppreciation}%`
    : 'Not shared';
  const rentalYieldLabel = project.performance?.rentalYield
    ? `${project.performance.rentalYield}%`
    : 'Not shared';
  const handoverLabel = project.handover
    ? `Q${project.handover.quarter} ${project.handover.year}`
    : 'TBD';
  const bedroomsLabel = project.bedrooms?.label ?? 'Not shared';
  const areaLabel = project.areaSqft?.label ?? 'Not shared';
  const marketTrendLabel = project.performance?.marketTrend
    ? project.performance.marketTrend === 'up'
      ? 'Rising'
      : project.performance.marketTrend === 'down'
        ? 'Softening'
        : 'Steady'
    : 'Not shared';

  return (
    <div className="bg-black text-white min-h-screen">
      <div 
        className="h-[45vh] sm:h-[50vh] bg-cover bg-center relative flex items-end p-6 sm:p-12"
        style={{ backgroundImage: `url(${project.images?.[0] || '/placeholder.jpg'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"/>
        <div className="relative z-10">
            <Badge className="mb-3 sm:mb-4 bg-blue-500 text-white">{project.status || project.availability || 'Under Construction'}</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black italic uppercase tracking-tighter">{project.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 sm:mt-2 text-zinc-300 text-sm sm:text-base">
                <div className="flex items-center gap-2"><Building className="h-4 w-4 sm:h-5 sm:w-5"/><span>{project.developer}</span></div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 sm:h-5 sm:w-5"/><span>{project.location.area}, {project.location.city}</span></div>
            </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
            <div className="lg:col-span-2 space-y-12">
                <Card className="bg-zinc-900 border-white/10 rounded-xl sm:rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">Project Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-zinc-400">
                          {project.description?.full || project.description?.short || 'No description available.'}
                        </p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  <InfoCard icon={DollarSign} label="Starting Price" value={priceLabel} />
                  <InfoCard icon={TrendingUp} label="Est. ROI" value={roiLabel} />
                  <InfoCard icon={BarChart} label="Est. Appreciation" value={appreciationLabel} />
                  <InfoCard icon={Calendar} label="Handover" value={handoverLabel} />
                  <InfoCard icon={Building} label="Bedrooms" value={bedroomsLabel} />
                  <InfoCard icon={Home} label="Home Size" value={areaLabel} />
                  <InfoCard icon={BarChart} label="Rental Yield" value={rentalYieldLabel} />
                  <InfoCard icon={Globe} label="Market Trend" value={marketTrendLabel} />
                </div>

                {(project.features?.length ?? 0) > 0 && (
                  <Card className="bg-zinc-900 border-white/10 rounded-xl sm:rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">Features & Amenities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-zinc-300">
                        {project.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-zinc-900 border-white/10 rounded-xl sm:rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">Price & Availability</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-zinc-300">
                    <InfoRow label="Starting from" value={priceLabel} />
                    <InfoRow
                      label="Avg. size"
                      value={project.price?.sqftAvg ? `${project.price.sqftAvg.toLocaleString()} sqft` : 'Not shared'}
                    />
                    <InfoRow label="Inventory updated" value={formatDate(project.unitsStockUpdatedAt)} />
                    <InfoRow label="Availability" value={project.availability || project.status || 'Available'} />
                  </CardContent>
                </Card>

                {(project.performance?.priceHistory?.length ?? 0) > 0 && (
                  <Card className="bg-zinc-900 border-white/10 rounded-xl sm:rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">Price History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-zinc-300">
                        {project.performance.priceHistory.map((entry) => (
                          <InfoRow
                            key={entry.year}
                            label={String(entry.year)}
                            value={formatPrice(entry.avgPrice)}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

            </div>

            <div className="space-y-6">
                <Card className="bg-blue-600 text-white rounded-2xl p-6 sm:p-8 text-center">
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Interested in this project?</h3>
                    <p className="text-blue-200 mb-5 sm:mb-6 text-sm sm:text-base">Contact our sales team for a private consultation.</p>
                    <Button className="bg-white text-blue-600 hover:bg-zinc-200 w-full font-bold">Request a Call</Button>
                </Card>
                <Card className="bg-zinc-900 border-white/10 rounded-2xl p-6 sm:p-8">
                  <h3 className="font-bold mb-4">Project Details</h3>
                  <div className="space-y-3 text-sm text-zinc-300">
                    <InfoRow label="Developer" value={project.developer || 'Not shared'} />
                    <InfoRow
                      label="Location"
                      value={
                        project.location?.area && project.location?.city
                          ? `${project.location.area}, ${project.location.city}`
                          : 'Not shared'
                      }
                    />
                    <InfoRow label="Status" value={project.status || project.availability || 'Available'} />
                    {project.publicUrl && (
                      <LinkRow href={project.publicUrl} label="Project page" />
                    )}
                  </div>
                  {(project.tags?.length ?? 0) > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tags?.map((tag) => (
                        <Badge key={tag} className="bg-white/10 text-white border-white/10">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
};

function InfoCard({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) {
    return (
        <div className="bg-zinc-900 border border-white/10 rounded-xl p-3 sm:p-4 flex items-center gap-4">
            <div className="p-2 sm:p-3 bg-blue-600/10 rounded-lg text-blue-500">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
                <p className="text-xs text-zinc-400 font-semibold">{label}</p>
                <p className="text-base sm:text-lg font-bold text-white">{value}</p>
            </div>
        </div>
    )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
      <span className="text-zinc-500 text-xs uppercase tracking-widest">{label}</span>
      <span className="text-white font-semibold text-sm text-right">{value}</span>
    </div>
  );
}

function LinkRow({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 last:border-b-0 last:pb-0 text-blue-400 hover:text-blue-200 transition-colors"
    >
      <span className="text-zinc-500 text-xs uppercase tracking-widest">{label}</span>
      <span className="text-sm font-semibold">Open</span>
    </a>
  );
}

export default ProjectDetailPage;
