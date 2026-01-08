'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Phone, Mail, Clock, Send, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { captureLead } from "@/lib/leads";
import { useCampaignAttribution } from "@/hooks/useCampaignAttribution";

interface CtaFormBlockProps {
  headline?: string;
  subtext?: string;
  tenantId?: string;
  projectName?: string;
  siteId?: string;
}

export function CtaFormBlock({ 
    headline = "Schedule a Private Viewing", 
  subtext = "Our experts are ready to assist you in finding your dream property.",
  tenantId = "public",
  projectName = "Private Viewing",
  siteId,
}: CtaFormBlockProps) {
  const { toast } = useToast();
  const attribution = useCampaignAttribution();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        await captureLead({
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            phone: formData.phone,
            project: projectName || 'Private Viewing',
            source: 'cta-form-block',
            context: { page: 'cta-form', buttonId: 'cta-form-submit', service: 'viewing' },
            metadata: { message: formData.message, siteId },
            attribution: attribution ?? undefined,
            tenantId,
            siteId,
        });

        setIsSubmitted(true);
        toast({
            title: "Message Sent",
            description: "Your inquiry has been received. Our team will contact you shortly.",
        });
    } catch (error) {
        console.error("Lead submission error:", error);
        toast({
            title: "Submission Error",
            description: "Failed to send message. Please try again.",
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-32 overflow-hidden bg-muted/10">
      
      <div className="container relative z-10 mx-auto px-6 max-w-7xl">
        <div className="max-w-6xl mx-auto bg-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-border/40">
          <div className="grid lg:grid-cols-2">
            
            {/* Left Side: Context */}
            <div className="p-12 lg:p-16 flex flex-col justify-between relative bg-primary/5">
              <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/80 border border-border/50 text-xs font-medium mb-6 backdrop-blur-md shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Available for Consultation
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-foreground leading-[1.05]">{headline}</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">{subtext}</p>
                </motion.div>
                
                <div className="space-y-6 pt-4">
                    {[
                        { icon: Phone, title: "Direct Line", val: "+971 4 123 4567" },
                        { icon: Mail, title: "Email Us", val: "vip@entresite.ai" },
                        { icon: Clock, title: "Working Hours", val: "Mon - Sun: 9am - 8pm" }
                    ].map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                            viewport={{ once: true }}
                            className="flex items-center gap-4 group p-4 rounded-xl hover:bg-background/50 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 border border-border/50">
                                <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-foreground/80">{item.title}</h4>
                                <p className="text-base font-medium text-foreground">{item.val}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-border/40">
                  <p className="text-sm text-muted-foreground">
                      Prefer WhatsApp? <a href="#" className="underline hover:text-primary font-medium underline-offset-4">Chat with us now</a>
                  </p>
              </div>
            </div>

            {/* Right Side: Intelligent Form */}
            <div className="p-12 lg:p-16 bg-background relative min-h-[600px]">
                <AnimatePresence mode="wait">
                    {isSubmitted ? (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="h-full flex flex-col items-center justify-center text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg shadow-green-100/50">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-bold">Request Received</h3>
                                <p className="text-muted-foreground">Our senior property advisor has been notified and will contact you via phone within 2 hours.</p>
                            </div>
                            <Button variant="outline" className="rounded-xl px-8 h-12" onClick={() => setIsSubmitted(false)}>
                                Send Another Inquiry
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.form 
                            key="form"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">First Name</Label>
                                    <Input 
                                        id="firstName" 
                                        required 
                                        placeholder="John" 
                                        className="h-12 bg-muted/30 border-border/40 focus:bg-background transition-colors rounded-xl"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Last Name</Label>
                                    <Input 
                                        id="lastName" 
                                        required 
                                        placeholder="Doe" 
                                        className="h-12 bg-muted/30 border-border/40 focus:bg-background transition-colors rounded-xl"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Email</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    required 
                                    placeholder="john@example.com" 
                                    className="h-12 bg-muted/30 border-border/40 focus:bg-background transition-colors rounded-xl"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                 <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Phone Number</Label>
                                 <Input 
                                    id="phone" 
                                    type="tel" 
                                    required 
                                    placeholder="+971..." 
                                    className="h-12 bg-muted/30 border-border/40 focus:bg-background transition-colors rounded-xl"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                 />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Message</Label>
                                <Textarea 
                                    id="message" 
                                    placeholder="I'm interested in floor plans for corner units..." 
                                    className="min-h-[140px] bg-muted/30 border-border/40 focus:bg-background transition-colors rounded-xl resize-none p-4"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                />
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Checkbox id="terms" required />
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                                >
                                    I agree to the terms and privacy policy.
                                </label>
                            </div>

                            <Button 
                                type="submit" 
                                size="lg" 
                                disabled={isSubmitting}
                                className="w-full h-14 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] gap-2"
                            >
                                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Message"}
                                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                            </Button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
