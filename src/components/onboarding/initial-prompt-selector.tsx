'use client';

import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Lightbulb, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const promptCategories = [
  {
    category: "Agent & Team Portfolios",
    icon: Building2,
    prompts: [
        { id: "agent-personal", title: "Personal Agent Portfolio", description: "Showcase your identity, experience, and listings.", prompt: "A clean, professional site for a real estate agent to showcase their personal brand, bio, and featured properties." },
        { id: "agent-modern", title: "Modern Agent Site", description: "A contemporary design with WhatsApp-first communication.", prompt: "A modern, minimalist website for a real estate agent, focused on lead capture via WhatsApp and featuring a curated list of properties." },
        { id: "agent-social", title: "Social Media Landing Page", description: "Perfect for agents linking from TikTok, Instagram, and YouTube.", prompt: "A mobile-first landing page for a real estate agent to use in their social media bio. It should be visually striking and have clear calls to action." },
        { id: "agent-luxury", title: "Luxury Agent Portfolio", description: "Premium, black-and-gold showcase for high-net-worth buyers.", prompt: "A high-end, luxurious website for an agent specializing in premium properties. The design should use a dark theme with gold accents to convey exclusivity." },
        { id: "agent-offplan", title: "Off-Plan Specialist Page", description: "Dedicated funnel for selling new-launch projects.", prompt: "A landing page for an agent who is an expert in off-plan properties. It needs to highlight upcoming projects and capture leads for early access." },
        { id: "agent-team", title: "Team Agent Site (2-10 Agents)", description: "Multi-agent portfolio with shared listings.", prompt: "A website for a real estate team of about 5 agents. It should have a main team page and individual agent profiles, plus a combined listings section." },
        { id: "agent-reputation", title: "Top Agent Reputation Page", description: "Credibility-heavy page with awards and testimonials.", prompt: "A one-page website focused on building credibility for a top-performing agent, featuring awards, client testimonials, and press mentions prominently." },
        { id: "agent-niche", title: "Area Specialist Page", description: "Hyper-local branding for a specific community.", prompt: "A website for an agent specializing in a specific area, for example, 'the Downtown Dubai specialist'. It should be rich with content about that community." },
    ]
  },
  // We can add more categories like "Company & Brokerage" or "Project Launches" here later
];

interface InitialPromptSelectorProps {
  onPromptSelect: (prompt: string) => void;
}

export function InitialPromptSelector({ onPromptSelect }: InitialPromptSelectorProps) {
  const [customPrompt, setCustomPrompt] = useState("");

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b text-center">
        <h1 className="text-2xl font-bold">How do you want to build your site?</h1>
        <p className="text-muted-foreground mt-1">Start with a custom prompt or choose a pre-built strategy.</p>
      </div>

      <div className="grid md:grid-cols-2 flex-1 h-full min-h-0">
        {/* Left Side: Custom Prompt */}
        <div className="p-6 flex flex-col justify-between border-r">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Describe Your Vision</h3>
            </div>
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., A minimalist landing page for a new luxury project in Dubai Hills, with a video hero and a simple contact form."
              className="h-48 text-base p-4"
            />
          </div>
          <Button 
            onClick={() => onPromptSelect(customPrompt)} 
            disabled={!customPrompt} 
            size="lg" 
            className="h-12 w-full text-base"
          >
            Start with this Prompt <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Right Side: Preset Prompts */}
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Start with a Strategy</h3>
          </div>
          <ScrollArea className="flex-1 -mr-4 pr-4">
            <div className="space-y-4">
              {promptCategories.map((cat, i) => (
                <div key={i}>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-muted-foreground">
                    <cat.icon className="h-4 w-4" />
                    {cat.category}
                  </h4>
                  <div className="space-y-2">
                    {cat.prompts.map((prompt) => (
                      <motion.div
                        key={prompt.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-4 rounded-lg border bg-background hover:bg-muted/50 hover:border-primary/30 cursor-pointer transition-all"
                        onClick={() => onPromptSelect(prompt.prompt)}
                      >
                        <p className="font-medium text-sm">{prompt.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{prompt.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
