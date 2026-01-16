'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Building, Users } from 'lucide-react';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { getRandomImage } from '@/lib/images';

export function AreaAnalysisBlock({
  areaName = "Dubai Marina",
  headline = "Market Analysis",
  stats = [
      { label: "Avg. Price", value: "AED 2.1M", change: "+12%", positive: true },
      { label: "Rental Yield", value: "7.2%", change: "+0.5%", positive: true },
      { label: "Occupancy Rate", value: "92%", change: "-1%", positive: false },
      { label: "Transactions", value: "1,240", change: "+15%", positive: true }
  ]
}: { areaName?: string, headline?: string, stats?: any[] }) {
  
  return (
    <section className="py-20 bg-muted/10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-8">
                <div>
                    <Badge variant="outline" className="mb-4">{areaName}</Badge>
                    <h2 className="text-3xl font-bold tracking-tight mb-4">{headline}</h2>
                    <p className="text-muted-foreground">
                        Comprehensive data on property performance in {areaName}. Make informed investment decisions backed by real-time market intelligence.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, i) => (
                        <Card key={i} className="border-0 shadow-md bg-background">
                            <CardContent className="p-4">
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">{stat.label}</p>
                                <div className="flex items-end justify-between">
                                    <span className="text-2xl font-bold">{stat.value}</span>
                                    <span className={`text-xs font-medium flex items-center ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                                        {stat.change} <TrendingUp className={`h-3 w-3 ml-1 ${!stat.positive && 'rotate-180'}`} />
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="relative aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-white/10 group">
                <ResponsiveImage 
                    src={getRandomImage('hero')} 
                    alt={areaName} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-white">
                            <Building className="h-5 w-5 text-orange-500" />
                            <span className="font-bold">150+ Towers</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                            <Users className="h-5 w-5 text-blue-500" />
                            <span className="font-bold">45k Residents</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
}
