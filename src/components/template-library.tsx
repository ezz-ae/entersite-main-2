'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { availableTemplates, SiteTemplate } from '@/lib/templates';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { getRandomImage } from '@/lib/images';
import { ArrowRight, Layout, Zap } from 'lucide-react';

interface TemplateLibraryProps {
  onTemplateSelect: (template: SiteTemplate) => void;
}

export function TemplateLibrary({ onTemplateSelect }: TemplateLibraryProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
      { id: "all", label: "All Templates" },
      { id: "agent-portfolio", label: "Agent Portfolios" },
      { id: "ready-made", label: "Ready Builds" },
      { id: "roadshow", label: "Events & Campaigns" },
      { id: "full-company", label: "Corporate" },
  ];

  const filteredTemplates = activeCategory === "all" 
      ? availableTemplates 
      : availableTemplates.filter(t => t.siteType === activeCategory);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans">
      {/* Hero */}
      <section className="pt-32 pb-20">
          <div className="container mx-auto px-6 max-w-[1800px] text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium mb-6">
                  <Layout className="h-3 w-3" />
                  Template Library
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Start with a World-Class Foundation</h1>
              <p className="text-zinc-400 text-xl max-w-2xl mx-auto leading-relaxed">
                  Choose from dozens of market-tested layouts designed for high conversion. Pre-loaded with real estate sections you can customize fast.
              </p>
          </div>
      </section>

      <div className="flex-1 container mx-auto px-6 max-w-[1800px] py-16">
          
          {/* Category Tabs */}
          <div className="flex justify-center mb-12">
              <div className="inline-flex p-1 bg-muted rounded-xl">
                  {categories.map((cat) => (
                      <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              activeCategory === cat.id 
                                  ? "bg-background text-foreground shadow-sm" 
                                  : "text-muted-foreground hover:text-foreground"
                          }`}
                      >
                          {cat.label}
                      </button>
                  ))}
              </div>
          </div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} onSelect={() => onTemplateSelect(template)} />
              ))}
          </div>

          {filteredTemplates.length === 0 && (
              <div className="text-center py-20">
                  <p className="text-muted-foreground">No templates found for this category.</p>
                  <Button variant="link" onClick={() => setActiveCategory("all")}>View all templates</Button>
              </div>
          )}

      </div>
    </div>
  );
}

function TemplateCard({ template, onSelect }: { template: SiteTemplate, onSelect: () => void }) {
    const previewImage = template.thumbnail || getRandomImage('hero');

    return (
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full border-border/50">
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <ResponsiveImage 
                    src={previewImage}
                    alt={template.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button onClick={onSelect} className="rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Use Template
                    </Button>
                </div>
                {template.siteType === 'ready-made' && (
                    <div className="absolute top-3 left-3">
                        <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-sm flex items-center gap-1">
                            <Zap className="h-3 w-3" /> Ready Build
                        </Badge>
                    </div>
                )}
            </div>
            
            <CardContent className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{template.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {template.description || "A high-performance template optimized for real estate conversion."}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground bg-muted/30">
                        Responsive
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground bg-muted/30">
                        SEO Ready
                    </Badge>
                    {template.siteType === 'ready-made' && (
                         <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground bg-muted/30">
                            Data Connected
                        </Badge>
                    )}
                </div>
            </CardContent>
            
            <CardFooter className="p-5 pt-0 border-t border-border/40 mt-auto bg-muted/10">
                <Button onClick={onSelect} variant="ghost" className="w-full justify-between hover:bg-background group/btn">
                    Start Building
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover/btn:text-primary group-hover/btn:translate-x-1 transition-all" />
                </Button>
            </CardFooter>
        </Card>
    )
}
