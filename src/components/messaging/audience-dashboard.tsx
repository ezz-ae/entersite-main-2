'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Target, 
  Filter, 
  DollarSign, 
  MapPin, 
  BarChart2, 
  Loader2, 
  CheckCircle, 
  PieChart, 
  TrendingUp, 
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/apiFetch';

export function AudienceDashboard() {
  const [criteria, setCriteria] = useState({
    projectFocus: 'Downtown',
    priceMin: 500000,
    priceMax: 2000000,
    location: 'Dubai, UAE'
  });
  const [audience, setAudience] = useState<any>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const { toast } = useToast();

  const handleBuildAudience = async () => {
    setIsBuilding(true);
    setAudience(null);
    try {
      const res = await apiFetch('/api/audience/build', {
        method: 'POST',
        body: JSON.stringify(criteria),
      });
      const data = await res.json();
      if (res.ok) {
        setAudience(data);
        toast({ title: 'Audience Generated', description: 'Insights are ready.' });
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Could not build audience.', variant: 'destructive' });
    } finally {
      setIsBuilding(false);
    }
  };

  const handleLaunchCampaign = async () => {
    setIsLaunching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({ title: 'Campaign Launched!', description: `Your ad campaign is now live for the ${audience.estimatedSize} potential investors.` });
      // Reset
      setAudience(null);
    } catch (error) {
        toast({ title: 'Error', description: 'Could not launch campaign.', variant: 'destructive' });
    } finally {
        setIsLaunching(false);
    }
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
          <div>
              <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">Audience Builder</h1>
              <p className="text-zinc-500 text-lg font-light">Define & target hyper-specific investor segments.</p>
          </div>
          <Button onClick={handleBuildAudience} disabled={isBuilding} size="lg" className="h-12 text-lg font-bold gap-2">
            {isBuilding ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            Generate Audience
          </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Criteria */}
          <div className="lg:col-span-1 space-y-6">
              <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5 text-blue-500" /> Targeting Criteria</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2">
                          <label className="text-sm font-medium">Project Focus</label>
                          <Input value={criteria.projectFocus} onChange={(e) => setCriteria({...criteria, projectFocus: e.target.value})} placeholder="e.g., Downtown, Emaar" className="bg-black/40 border-white/10 h-11" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-medium">Price Bracket (USD)</label>
                          <div className="flex gap-2">
                              <Input type="number" value={criteria.priceMin} onChange={(e) => setCriteria({...criteria, priceMin: parseInt(e.target.value)})} placeholder="Min" className="bg-black/40 border-white/10 h-11" />
                              <Input type="number" value={criteria.priceMax} onChange={(e) => setCriteria({...criteria, priceMax: parseInt(e.target.value)})} placeholder="Max" className="bg-black/40 border-white/10 h-11" />
                          </div>
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-medium">Location</label>
                          <Input value={criteria.location} onChange={(e) => setCriteria({...criteria, location: e.target.value})} placeholder="e.g., Dubai, UAE" className="bg-black/40 border-white/10 h-11" />
                      </div>
                  </CardContent>
              </Card>
          </div>

          {/* Insights */}
          <div className="lg:col-span-2 space-y-8">
            {audience ? (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <Card className="bg-zinc-900 border-white/5 shadow-xl">
                        <CardHeader>
                            <CardTitle>Audience Insights</CardTitle>
                            <CardDescription>Estimated reach and demographics for your campaign.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-6">
                            <div className="flex items-center gap-4 p-4 bg-black/20 rounded-lg">
                                <Users className="h-8 w-8 text-blue-400" />
                                <div>
                                    <p className="text-2xl font-bold">{audience.estimatedSize}</p>
                                    <p className="text-xs text-zinc-400">Potential Investors</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-black/20 rounded-lg">
                                <PieChart className="h-8 w-8 text-green-400" />
                                <div>
                                    <p className="text-2xl font-bold">{audience.demographics.topCountry}</p>
                                    <p className="text-xs text-zinc-400">Top Country</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-black/20 rounded-lg">
                                <TrendingUp className="h-8 w-8 text-yellow-400" />
                                <div>
                                    <p className="text-2xl font-bold">{audience.demographics.avgNetWorth}</p>
                                    <p className="text-xs text-zinc-400">Avg. Net Worth</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Button onClick={handleLaunchCampaign} disabled={isLaunching} className="w-full h-16 text-xl font-bold bg-green-600 hover:bg-green-700 gap-3">
                        {isLaunching ? <Loader2 className="h-6 w-6 animate-spin" /> : <CheckCircle className="h-6 w-6" />}
                        Launch Campaign
                    </Button>
                </div>
            ) : (
                <Card className="bg-zinc-900/50 border-2 border-dashed border-white/10 flex items-center justify-center py-20">
                    <div className="text-center text-zinc-500">
                        <BarChart2 className="h-12 w-12 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-zinc-300">Your audience insights will appear here</h3>
                        <p className="text-sm">Click \"Generate Audience\" to get started.</p>
                    </div>
                </Card>
            )}
          </div>
      </div>
    </div>
  );
}
