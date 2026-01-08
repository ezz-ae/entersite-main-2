'use client';

import React from "react";
import { CheckCircle, Calendar, CreditCard } from "lucide-react";

interface PaymentPlanBlockProps {
  headline?: string;
  subtext?: string;
  planType?: string;
  milestones?: { title: string; percentage: string; date: string }[];
}

export function PaymentPlanBlock({
  headline = "Flexible Payment Plan",
  subtext = "Secure your unit with a small down payment and pay the rest over convenient milestones.",
  planType = "60/40 Post-Handover",
  milestones = [
      { title: "Down Payment", percentage: "10%", date: "On Booking" },
      { title: "During Construction", percentage: "40%", date: "Linked to Construction" },
      { title: "On Handover", percentage: "10%", date: "Q4 2025" },
      { title: "Post-Handover", percentage: "40%", date: "Over 2 Years" }
  ]
}: PaymentPlanBlockProps) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">{headline}</h2>
          <p className="text-lg text-muted-foreground">{subtext}</p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl" />
                <div className="relative bg-card border rounded-2xl p-8 shadow-xl text-center space-y-6">
                    <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold">
                        {planType}
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-5xl font-bold text-foreground">50%</h3>
                        <p className="text-muted-foreground">Paid During Construction</p>
                    </div>
                    <div className="h-px bg-border w-1/2 mx-auto" />
                    <div className="space-y-2">
                        <h3 className="text-5xl font-bold text-foreground">50%</h3>
                        <p className="text-muted-foreground">Paid On/Post Handover</p>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {milestones.map((item, index) => (
                    <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md z-10">
                                {index + 1}
                            </div>
                            {index !== milestones.length - 1 && (
                                <div className="w-0.5 h-full bg-border -my-1" />
                            )}
                        </div>
                        <div className="bg-muted/30 p-4 rounded-lg flex-1 border hover:border-primary/50 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold text-lg">{item.title}</h4>
                                <span className="text-xl font-bold text-primary">{item.percentage}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                <Calendar className="h-4 w-4" />
                                {item.date}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
