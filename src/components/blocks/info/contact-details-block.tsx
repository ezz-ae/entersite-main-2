'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Globe, Linkedin, Instagram, Facebook } from "lucide-react";
import { SAFE_IMAGES } from "@/lib/images";

interface ContactDetailsBlockProps {
  headline?: string;
  subtext?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export function ContactDetailsBlock({
  headline = "Get in Touch",
  subtext = "Our dedicated team is here to answer your questions and guide you through the process.",
  address = "Office 123, Business Bay Tower, Dubai, UAE",
  phone = "+971 4 123 4567",
  email = "info@realestate.com",
  website = "www.realestate.com"
}: ContactDetailsBlockProps) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold mb-4">{headline}</h2>
                    <p className="text-muted-foreground text-lg">{subtext}</p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4 group">
                        <div className="bg-muted p-3 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Visit Us</h4>
                            <p className="text-muted-foreground">{address}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 group">
                        <div className="bg-muted p-3 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Phone className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Call Us</h4>
                            <p className="text-muted-foreground">{phone}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 group">
                        <div className="bg-muted p-3 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Mail className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Email Us</h4>
                            <p className="text-muted-foreground">{email}</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <p className="font-medium mb-4">Follow Us</p>
                    <div className="flex gap-4">
                        <Button variant="outline" size="icon" className="rounded-full hover:text-primary hover:border-primary">
                            <Linkedin className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full hover:text-pink-600 hover:border-pink-600">
                            <Instagram className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full hover:text-blue-600 hover:border-blue-600">
                            <Facebook className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="h-[400px] bg-muted rounded-2xl overflow-hidden border relative group">
                 {/* Map Placeholder */}
                 <div 
                    style={{ backgroundImage: `url(${SAFE_IMAGES.maps.google})` }}
                    className="absolute inset-0 bg-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500"
                 ></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                     <Button className="shadow-xl">View on Google Maps</Button>
                 </div>
            </div>
        </div>
      </div>
    </section>
  );
}
