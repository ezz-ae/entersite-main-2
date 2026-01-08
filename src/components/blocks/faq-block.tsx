'use client';

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqBlockProps {
  headline?: string;
  subtext?: string;
  faqItems?: FaqItem[];
}

export function FaqBlock({ 
    headline = "Frequently Asked Questions", 
    subtext = "Find answers to common questions about our properties and services.",
    faqItems = [
        { question: "What types of properties do you offer?", answer: "We offer a wide range of properties including luxury villas, modern apartments, and exclusive townhouses in prime locations." },
        { question: "Can I schedule a viewing online?", answer: "Yes, you can easily schedule a private viewing through our contact form. One of our agents will get in touch with you to confirm the details." },
        { question: "Are there financing options available?", answer: "We work with several trusted financial partners to offer you flexible financing options. Please contact us for more information." }
    ]
}: FaqBlockProps) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{headline}</h2>
          <p className="text-lg text-muted-foreground">{subtext}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4 bg-card shadow-sm">
                <AccordionTrigger className="text-lg font-medium hover:no-underline hover:text-primary transition-colors py-6">
                    {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
