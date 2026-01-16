
'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, PieChart, ArrowUpRight } from "lucide-react";

interface RoiCalculatorBlockProps {
  headline?: string;
  subtext?: string;
}

export function RoiCalculatorBlock({
  headline = "Calculate Your ROI",
  subtext = "See the potential returns on your property investment over the next 5 years."
}: RoiCalculatorBlockProps) {
  return (
    <section className="py-20 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{headline}</h2>
          <p className="text-lg text-muted-foreground">{subtext}</p>
        </div>

        <div className="max-w-5xl mx-auto bg-card border rounded-2xl shadow-xl overflow-hidden grid lg:grid-cols-2">
            <div className="p-8 lg:p-12 space-y-8">
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Property Value (AED)</label>
                        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg border">
                            <span className="text-2xl font-bold">1,500,000</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Expected Annual Rent</label>
                            <div className="bg-muted/30 p-3 rounded-lg border text-lg font-semibold">
                                120,000
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Annual Appreciation (%)</label>
                            <div className="bg-muted/30 p-3 rounded-lg border text-lg font-semibold">
                                5.0%
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Holding Period (Years)</label>
                        <div className="flex gap-2">
                            {[1, 3, 5, 10].map(y => (
                                <Button key={y} variant={y === 5 ? "default" : "outline"} className="flex-1">
                                    {y} Yrs
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <Button className="w-full h-12 text-lg">Calculate Returns</Button>
            </div>

            <div className="bg-muted/50 p-8 lg:p-12 flex flex-col justify-center border-l">
                <div className="space-y-8">
                    <div className="flex items-start gap-4">
                        <div className="bg-green-100 p-3 rounded-full text-green-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total ROI (5 Years)</p>
                            <h4 className="text-3xl font-bold text-green-600">+42.5%</h4>
                            <p className="text-xs text-muted-foreground mt-1">Includes rental income & capital appreciation</p>
                        </div>
                    </div>

                    <div className="h-px bg-border w-full" />

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Total Rental Income</p>
                            <p className="text-xl font-semibold">AED 600,000</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Capital Appreciation</p>
                            <p className="text-xl font-semibold">AED 375,000</p>
                        </div>
                    </div>

                    <div className="bg-primary/10 rounded-xl p-4 border border-primary/20 mt-4">
                        <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-primary text-sm">Market Insight</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Dubai's real estate market has consistently outperformed global averages, with prime areas showing even higher appreciation rates.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
