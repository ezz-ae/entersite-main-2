
'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { captureLead } from "@/lib/leads";
import { useCampaignAttribution } from "@/hooks/useCampaignAttribution";

interface NewsletterBlockProps {
  headline?: string;
  subtext?: string;
  ctaText?: string;
  tenantId?: string;
  projectName?: string;
  siteId?: string;
}

export function NewsletterBlock({
  headline = "Stay Ahead of the Market",
  subtext = "Subscribe to this newsletter for exclusive off-plan alerts, market analysis, and investment tips delivered straight to your inbox.",
  ctaText = "Subscribe Now",
  tenantId = "public",
  projectName = "Newsletter",
  siteId,
}: NewsletterBlockProps) {
  const attribution = useCampaignAttribution();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await captureLead({
        email,
        source: 'newsletter-block',
        project: projectName,
        context: { page: 'newsletter-block', buttonId: 'newsletter-submit', service: 'newsletter' },
        metadata: { siteId },
        attribution: attribution ?? undefined,
        tenantId,
        siteId,
      });
      setSubscribed(true);
    } catch (error) {
      console.error('Newsletter subscription failed', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-card border rounded-3xl p-8 md:p-16 text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 space-y-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 rotate-3">
                    <Mail className="h-8 w-8" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{headline}</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtext}</p>
                
                {subscribed ? (
                  <p className="text-sm text-green-600 font-medium pt-4">Subscribed! Watch your inbox for the next Entrestate drop.</p>
                ) : (
                  <>
                    <form className="max-w-md mx-auto flex gap-2 pt-4" onSubmit={handleSubscribe}>
                        <Input 
                            placeholder="Enter your email address" 
                            type="email" 
                            className="h-12 bg-background"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button size="lg" className="h-12 px-6" disabled={submitting}>
                            {submitting ? 'Joining…' : ctaText}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                    <p className="text-xs text-muted-foreground pt-4">We respect your privacy. No spam, ever.</p>
                  </>
                )}
            </div>
        </div>
      </div>
    </section>
  );
}
