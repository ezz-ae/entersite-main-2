'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Globe, 
  ArrowUp,
  ArrowDown,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

export function SeoManager() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Card className="w-full h-full border-0 shadow-none bg-background">
      <CardHeader className="px-0 pt-0">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-2xl">SEO Command Center</CardTitle>
                <CardDescription>Optimize your site visibility and track keyword rankings.</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" /> Scan Site
            </Button>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 p-1">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="keywords">Rankings</TabsTrigger>
                <TabsTrigger value="audit">Site Audit</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
                {/* Health Score */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-card border rounded-xl flex items-center gap-6">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-muted/30" />
                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={351} strokeDashoffset={351 - (351 * 0.92)} className="text-green-500" />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-3xl font-bold">92</span>
                                <span className="text-xs text-muted-foreground uppercase">Health</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Excellent Condition</h4>
                            <p className="text-sm text-muted-foreground mb-4">Your site is optimized for search engines.</p>
                            <div className="flex gap-4 text-sm">
                                <div><span className="font-bold">0</span> Errors</div>
                                <div><span className="font-bold text-yellow-600">3</span> Warnings</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-muted/20 border rounded-xl flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Organic Traffic</p>
                                    <h3 className="text-2xl font-bold">4,231</h3>
                                </div>
                            </div>
                            <div className="text-right">
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">+18%</Badge>
                                <p className="text-xs text-muted-foreground mt-1">vs last month</p>
                            </div>
                        </div>
                         <div className="p-4 bg-muted/20 border rounded-xl flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                                    <Search className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Keywords Ranked</p>
                                    <h3 className="text-2xl font-bold">128</h3>
                                </div>
                            </div>
                            <div className="text-right">
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">+5</Badge>
                                <p className="text-xs text-muted-foreground mt-1">new top 10</p>
                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="keywords" className="space-y-4">
                 <div className="border rounded-xl overflow-hidden">
                    <div className="grid grid-cols-12 bg-muted/40 p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <div className="col-span-5">Keyword</div>
                        <div className="col-span-2 text-center">Position</div>
                        <div className="col-span-2 text-center">Volume</div>
                        <div className="col-span-3 text-right">Traffic %</div>
                    </div>
                    <div className="divide-y">
                        {[
                            { kw: "luxury apartments dubai", pos: 3, change: 1, vol: "12K", traf: "25%" },
                            { kw: "buy villa palm jumeirah", pos: 1, change: 0, vol: "5.4K", traf: "18%" },
                            { kw: "emaar off plan", pos: 5, change: -1, vol: "8.1K", traf: "12%" },
                            { kw: "dubai real estate investment", pos: 8, change: 2, vol: "22K", traf: "8%" },
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-12 p-4 items-center hover:bg-muted/20 transition-colors">
                                <div className="col-span-5 font-medium">{row.kw}</div>
                                <div className="col-span-2 text-center flex items-center justify-center gap-2">
                                    <span className="text-lg font-bold">{row.pos}</span>
                                    {row.change > 0 && <span className="text-xs text-green-600 flex items-center"><ArrowUp className="h-3 w-3" />{row.change}</span>}
                                    {row.change < 0 && <span className="text-xs text-red-600 flex items-center"><ArrowDown className="h-3 w-3" />{Math.abs(row.change)}</span>}
                                    {row.change === 0 && <span className="text-xs text-muted-foreground">-</span>}
                                </div>
                                <div className="col-span-2 text-center text-sm text-muted-foreground">{row.vol}</div>
                                <div className="col-span-3">
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className="text-sm font-medium">{row.traf}</span>
                                        <Progress value={parseInt(row.traf)} className="w-16 h-2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
                <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Missing Meta Descriptions</h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">3 pages are missing meta descriptions. This affects click-through rates.</p>
                            <Button size="sm" variant="outline" className="mt-3 bg-white text-yellow-800 border-yellow-200">Auto-Fix with AI</Button>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 border border-green-200 bg-green-50 dark:bg-green-900/10 rounded-xl">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-green-900 dark:text-green-100">Mobile Usability</h4>
                            <p className="text-sm text-green-700 dark:text-green-300 mt-1">Your site passed all mobile responsiveness tests.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 border rounded-xl">
                        <div className="p-2 bg-muted rounded-full">
                            <ExternalLink className="h-4 w-4" />
                        </div>
                        <div>
                            <h4 className="font-semibold">Broken Links</h4>
                            <p className="text-sm text-muted-foreground mt-1">No broken links detected.</p>
                        </div>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
