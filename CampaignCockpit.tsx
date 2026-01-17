'use client';

import { useState } from 'react';
import { AdsCampaign, googleAdsService } from '@/server/ads/google/googleAdsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle, CheckCircle, ShieldAlert, TrendingUp } from 'lucide-react';

interface CampaignCockpitProps {
  initialCampaign: AdsCampaign;
}

export function CampaignCockpit({ initialCampaign }: CampaignCockpitProps) {
  const [campaign, setCampaign] = useState<AdsCampaign>(initialCampaign);
  const [momentum, setMomentum] = useState([initialCampaign.occalizer.momentum]);

  // Recalculate projections locally for instant feedback
  const currentOccalizer = googleAdsService.calculateOccalizer(
    momentum[0],
    campaign.planner.dailyBudgetAED
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{campaign.planner.cityArea}</h1>
            <Badge variant={campaign.status === 'live' ? 'default' : 'secondary'}>
              {campaign.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {campaign.planner.unitType} • {campaign.planner.contactRoute}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Save Draft</Button>
          <Button disabled={campaign.status === 'live'}>
            {campaign.status === 'live' ? 'Campaign Live' : 'Approve & Launch'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Control Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* THE OCCALIZER */}
          <Card className="border-2 border-primary/10 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>Daily Momentum</CardTitle>
                <Badge 
                  variant={currentOccalizer.verdict === 'RISKY' ? 'destructive' : 'default'}
                  className="text-sm px-3 py-1"
                >
                  VERDICT: {currentOccalizer.verdict}
                </Badge>
              </div>
              <CardDescription>Adjust market pressure. Higher momentum increases volume but risks efficiency.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-6 px-2">
                <div className="relative h-6 rounded-full bg-gradient-to-r from-teal-400 via-orange-300 to-red-500 mb-8">
                  <Slider
                    defaultValue={[campaign.occalizer.momentum]}
                    max={100}
                    step={1}
                    value={momentum}
                    onValueChange={setMomentum}
                    className="absolute inset-0"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <div className="text-xs text-muted-foreground uppercase">Est. Leads/Day</div>
                    <div className="text-xl font-bold">
                      {currentOccalizer.projections.leadsMin} - {currentOccalizer.projections.leadsMax}
                    </div>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <div className="text-xs text-muted-foreground uppercase">Est. CPL (AED)</div>
                    <div className="text-xl font-bold">
                      {currentOccalizer.projections.cplMinAED} - {currentOccalizer.projections.cplMaxAED}
                    </div>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <div className="text-xs text-muted-foreground uppercase">Competition</div>
                    <div className="text-xl font-bold capitalize">
                      {currentOccalizer.projections.competition}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="launch" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="launch">Smart Planner</TabsTrigger>
              <TabsTrigger value="risk">Risk Control</TabsTrigger>
              <TabsTrigger value="reports">Intent Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="launch" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Blueprint</CardTitle>
                  <CardDescription>Define the core parameters. We handle the keywords.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Target City / Area</Label>
                      <Input defaultValue={campaign.planner.cityArea} />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit Type / Offer</Label>
                      <Input defaultValue={campaign.planner.unitType} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Daily Budget (AED)</Label>
                      <Input type="number" defaultValue={campaign.planner.dailyBudgetAED} />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Route</Label>
                      <Input defaultValue={campaign.planner.contactRoute} disabled />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Landing Page URL</Label>
                    <Input defaultValue={campaign.landingPageUrl} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Stop-Loss & Guardrails</CardTitle>
                  <CardDescription>System will intervene if these thresholds are breached.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="h-5 w-5 text-orange-500" />
                      <div>
                        <div className="font-medium">Spend Cap Protection</div>
                        <div className="text-sm text-muted-foreground">Hard stop at {campaign.caps.totalCapAED} AED total spend.</div>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Fairness Validity Check</div>
                        <div className="text-sm text-muted-foreground">Pause if lead validity drops below 60% for 48h.</div>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Intent Clusters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {['Payment Plan Queries', 'Ready-to-move', 'Area + Price'].map(tag => (
                        <Badge key={tag} variant="secondary" className="text-sm py-1">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Fairness Validity</CardTitle>
                    <CardDescription>Deal Fairness Level (DFL)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {campaign.fairness ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-3xl font-bold">{campaign.fairness.dflPercent.toFixed(0)}%</span>
                            <span className="text-xs text-muted-foreground uppercase">Score</span>
                          </div>
                          <Badge 
                            variant={campaign.fairness.band === 'RED' ? 'destructive' : 'outline'} 
                            className={campaign.fairness.band === 'GREEN' ? 'border-green-500 text-green-600 bg-green-50' : campaign.fairness.band === 'YELLOW' ? 'border-yellow-500 text-yellow-600 bg-yellow-50' : ''}
                          >
                            {campaign.fairness.band}
                          </Badge>
                        </div>
                        
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              campaign.fairness.band === 'GREEN' ? 'bg-green-500' : 
                              campaign.fairness.band === 'YELLOW' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${campaign.fairness.dflPercent}%` }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Lead Validity (LV):</span>
                            <span className="font-mono text-foreground">{campaign.fairness.lv.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time Validity (TV):</span>
                            <span className="font-mono text-foreground">{campaign.fairness.tv.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic py-4">
                        Fairness data accumulates after launch.
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">12</div>
                    <div className="text-sm text-muted-foreground">Leads (Last 7d)</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scenario State</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg">{campaign.scenario.state.replace('_', ' ')}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                System is monitoring lead velocity against your momentum settings.
              </p>
            </CardContent>
          </Card>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Refiner Note:</strong> Ensure your landing page has a clear WhatsApp CTA before launch.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
