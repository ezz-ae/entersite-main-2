'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { captureLead } from "@/lib/leads";
import { useCampaignAttribution } from "@/hooks/useCampaignAttribution";

interface HeroLeadFormBlockProps {
  headline?: string;
  subtext?: string;
  backgroundImage?: string;
  tenantId?: string;
  projectName?: string;
  siteId?: string;
}

export function HeroLeadFormBlock({
  headline = "Find Your Dream Home in Dubai",
  subtext = "Browse thousands of verified listings and get exclusive offers directly from developers.",
  backgroundImage = "https://images.unsplash.com/photo-1512453979798-5ea904ac66de?auto=format&fit=crop&q=80&w=2000",
  tenantId = "public",
  projectName,
  siteId,
}: HeroLeadFormBlockProps) {
  const attribution = useCampaignAttribution();
  const [formState, setFormState] = useState({ location: "", propertyType: "", priceRange: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await captureLead({
        source: "hero-lead-form",
        project: projectName || formState.location || "Hero Form Lead",
        context: { page: 'hero-lead-form', buttonId: 'hero-lead-search', service: 'listings' },
        metadata: { ...formState, siteId },
        attribution: attribution ?? undefined,
        tenantId,
        siteId,
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit hero lead form", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
             <Image 
                src={backgroundImage} 
                alt="Hero Background" 
                fill 
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container relative z-10 px-4 flex flex-col items-center">
            <div className="text-center text-white max-w-3xl mb-10 space-y-4">
                 <h1 className="text-4xl md:text-5xl font-bold">{headline}</h1>
                 <p className="text-xl opacity-90">{subtext}</p>
            </div>

            <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-2 md:p-4">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                    <p className="text-2xl font-semibold text-black">Thanks! We'll send matching inventory shortly.</p>
                    <p className="text-sm text-zinc-500">An Entrestate advisor will follow up via WhatsApp.</p>
                    <Button variant="outline" onClick={() => setSubmitted(false)}>Submit another search</Button>
                  </div>
                ) : (
                  <form className="flex flex-col md:flex-row gap-2" onSubmit={handleSubmit}>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                          <Input
                            placeholder="Location (e.g. Dubai Marina)"
                            className="h-12 border-none bg-gray-50 focus:ring-0"
                            value={formState.location}
                            onChange={(e) => setFormState((prev) => ({ ...prev, location: e.target.value }))}
                            required
                          />
                          <select
                            className="h-12 px-3 rounded-md bg-gray-50 border-none text-sm text-muted-foreground focus:outline-none focus:ring-0"
                            value={formState.propertyType}
                            onChange={(e) => setFormState((prev) => ({ ...prev, propertyType: e.target.value }))}
                            required
                          >
                              <option value="">Property Type</option>
                              <option value="apartment">Apartment</option>
                              <option value="villa">Villa</option>
                              <option value="townhouse">Townhouse</option>
                          </select>
                           <select
                            className="h-12 px-3 rounded-md bg-gray-50 border-none text-sm text-muted-foreground focus:outline-none focus:ring-0"
                            value={formState.priceRange}
                            onChange={(e) => setFormState((prev) => ({ ...prev, priceRange: e.target.value }))}
                            required
                           >
                              <option value="">Price Range</option>
                              <option value="up-to-1m">Up to 1M AED</option>
                              <option value="1-3m">1M - 3M AED</option>
                              <option value="3m-plus">3M+ AED</option>
                          </select>
                      </div>
                      <Button type="submit" size="lg" className="h-12 px-8 text-base" disabled={loading}>
                        {loading ? 'Matching inventory…' : 'Search'}
                      </Button>
                  </form>
                )}
            </div>
        </div>
    </section>
  );
}
