'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Search, 
  MousePointerClick, 
  Plus, 
  Rocket, 
  TrendingUp,
  Zap,
  Target
} from 'lucide-react';

export function GoogleAdsDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Smart Google Ads</h2>
          <p className="text-muted-foreground">High-intent search campaigns managed by Smart.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-6 gap-2 h-11">
          <Plus className="h-4 w-4" /> New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard label="Total Spend" value="AED 4,200" trend="-12%" icon={Zap} />
        <MetricCard label="Avg. Cost Per Lead" value="AED 48" trend="+4%" icon={Target} positive={false} />
        <MetricCard label="Active Keywords" value="124" trend="+12" icon={Search} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-blue-500" />
              Active Campaign: Palm Jebel Ali
            </CardTitle>
            <CardDescription>Targeting investors in UK, UAE and Germany.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Conversion Health</span>
                <Badge className="bg-green-500/10 text-green-600 border-0">Excellent</Badge>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[92%]" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/30 border space-y-3">
               <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Top Performing Ad Copy</p>
               <div className="space-y-2">
                  <p className="text-sm font-bold text-blue-500 hover:underline cursor-pointer">Luxury Villas at Palm Jebel Ali | Nakheel Official Launch</p>
                  <p className="text-xs text-muted-foreground">Secure your beachfront villa today. Direct from developer. Flexible payment plans...</p>
               </div>
            </div>

            <div className="flex gap-2">
               <Button variant="outline" className="flex-1">Edit Keywords</Button>
               <Button variant="outline" className="flex-1">View Analytics</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
           <CardHeader>
              <CardTitle>Keyword Opportunities</CardTitle>
              <CardDescription>Smart found these high-ROI keywords for your projects.</CardDescription>
           </CardHeader>
           <CardContent>
              <div className="space-y-2">
                 <KeywordRow term="off plan projects dubai" vol="12.5K" comp="High" roi="High" />
                 <KeywordRow term="beachfront apartments creek" vol="4.2K" comp="Low" roi="Very High" />
                 <KeywordRow term="emaar villas launch" vol="8.9K" comp="Medium" roi="High" />
                 <KeywordRow term="palm jumeirah resale" vol="22.1K" comp="High" roi="Medium" />
              </div>
              <Button variant="ghost" className="w-full mt-6 text-primary hover:bg-primary/5 font-bold">
                 Sync All to Google Ads
              </Button>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend, icon: Icon, positive = true }: any) {
  return (
    <Card className="bg-muted/10 border-border/40">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold">{value}</span>
          <span className={cn(
            "text-xs font-bold mb-1.5",
            positive ? "text-green-600" : "text-red-600"
          )}>{trend}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function KeywordRow({ term, vol, comp, roi }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
      <div className="flex flex-col">
        <span className="text-sm font-medium">{term}</span>
        <span className="text-[10px] text-muted-foreground">{vol} Monthly Searches</span>
      </div>
      <div className="flex items-center gap-3">
         <Badge variant="outline" className="text-[10px] uppercase font-bold">{comp}</Badge>
         <Badge className="bg-blue-500/10 text-blue-600 border-0 text-[10px] font-bold">ROI: {roi}</Badge>
         <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-blue-500">
            <Plus className="h-4 w-4" />
         </Button>
      </div>
    </div>
  )
}

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
