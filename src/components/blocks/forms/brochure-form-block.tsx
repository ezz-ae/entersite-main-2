'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDown } from "lucide-react";
import { captureLead } from "@/lib/leads";
import { useCampaignAttribution } from "@/hooks/useCampaignAttribution";

interface BrochureFormBlockProps {
  headline?: string;
  subtext?: string;
  brochureTitle?: string;
  coverImage?: string;
  tenantId?: string;
  projectName?: string;
  siteId?: string;
}

export function BrochureFormBlock({
  headline = "Download Official Brochure",
  subtext = "Get the complete floor plans, payment details, and investment analysis.",
  brochureTitle = "Elysian Residence - Investor Guide",
  coverImage = "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600",
  tenantId = "public",
  projectName = "Brochure Request",
  siteId,
}: BrochureFormBlockProps) {
  const attribution = useCampaignAttribution();
  const [formState, setFormState] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await captureLead({
        name: formState.name,
        phone: formState.phone,
        email: formState.email,
        source: "brochure-form",
        project: projectName,
        context: { page: 'brochure-form', buttonId: 'brochure-download', service: 'content-download' },
        metadata: { brochureTitle, siteId },
        attribution: attribution ?? undefined,
        tenantId,
        siteId,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit brochure form', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-lg border overflow-hidden flex flex-col md:flex-row">
            {/* Visual Side */}
            <div className="md:w-5/12 bg-primary/10 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-border/50">
                 <div className="relative w-48 aspect-[1/1.4] shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-500 mb-6">
                     {/* Placeholder for brochure cover */}
                     <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-4 border border-gray-200">
                         <div className="w-full h-1/2 bg-gray-100 mb-4"></div>
                         <div className="w-full h-2 bg-gray-200 mb-2"></div>
                         <div className="w-2/3 h-2 bg-gray-200"></div>
                     </div>
                 </div>
                 <h3 className="font-semibold text-primary">{brochureTitle}</h3>
                 <p className="text-xs text-muted-foreground mt-1">PDF • 12.5 MB</p>
            </div>

            {/* Form Side */}
            <div className="md:w-7/12 p-8 md:p-12 bg-background">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">{headline}</h2>
                    <p className="text-muted-foreground text-sm">{subtext}</p>
                </div>
                
                {submitted ? (
                  <div className="space-y-4 py-6 text-center">
                     <p className="text-xl font-semibold text-foreground">Brochure unlocked!</p>
                     <Button className="w-full" variant="outline" onClick={() => setSubmitted(false)}>
                       Send to another email
                     </Button>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label htmlFor="name">Name</Label>
                              <Input
                                id="name"
                                placeholder="Full Name"
                                value={formState.name}
                                onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                                required
                              />
                          </div>
                           <div className="space-y-2">
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                id="phone"
                                placeholder="+971..."
                                value={formState.phone}
                                onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                                required
                              />
                          </div>
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={formState.email}
                            onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                            required
                          />
                      </div>
                      
                      <Button type="submit" className="w-full h-11 mt-2" disabled={loading}>
                          <FileDown className="mr-2 h-4 w-4" />
                          {loading ? 'Preparing Brochure…' : 'Download Now'}
                      </Button>
                      <p className="text-[10px] text-center text-muted-foreground mt-4">
                          By downloading, you agree to receive property updates.
                      </p>
                  </form>
                )}
            </div>
        </div>
      </div>
    </section>
  );
}
