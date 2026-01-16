
'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Phone, Info, UserPlus, Download, ArrowRight, BookOpen } from "lucide-react";

interface CtaGridBlockProps {
  headline?: string;
  subtext?: string;
}

export function CtaGridBlock({
  headline = "Ready to Take the Next Step?",
  subtext = "Choose how you'd like to proceed with your investment journey."
}: CtaGridBlockProps) {
  
  const actions = [
      {
          icon: <Calendar className="h-6 w-6" />,
          label: "Book a Viewing",
          desc: "Schedule a private tour of the property.",
          btnText: "Book Now",
          variant: "default" as const
      },
      {
          icon: <Download className="h-6 w-6" />,
          label: "Download Brochure",
          desc: "Get the full floor plans and payment details.",
          btnText: "Download",
          variant: "outline" as const
      },
      {
          icon: <Phone className="h-6 w-6" />,
          label: "Request a Call",
          desc: "Speak with a property consultant today.",
          btnText: "Get a Call",
          variant: "secondary" as const
      },
      {
          icon: <UserPlus className="h-6 w-6" />,
          label: "Register Interest",
          desc: "Sign up for updates and launch alerts.",
          btnText: "Register Now",
          variant: "default" as const
      }
  ];

  return (
    <section className="py-20 bg-background border-t">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">{headline}</h2>
          <p className="text-muted-foreground">{subtext}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {actions.map((action, i) => (
                <div key={i} className="bg-card border rounded-xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                        {action.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{action.label}</h3>
                    <p className="text-sm text-muted-foreground mb-6 flex-1">{action.desc}</p>
                    <Button variant={action.variant} className="w-full">
                        {action.btnText}
                    </Button>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
