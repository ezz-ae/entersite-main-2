
'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Clock, Users, ArrowRight, Star, Ticket } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface RoadshowBlockProps {
  eventName?: string;
  city?: string;
  date?: string;
  time?: string;
  venue?: string;
  description?: string;
  imageUrl?: string;
}

export function RoadshowBlock({
  eventName = "Dubai Property Show 2025",
  city = "London",
  date = "October 15-17, 2025",
  time = "10:00 AM - 6:00 PM",
  venue = "ExCel London, Royal Victoria Dock",
  description = "Join us for the exclusive Dubai Property Show in London. Discover high-yield investment opportunities, meet top developers, and get exclusive event-only offers on luxury properties.",
  imageUrl = "https://images.unsplash.com/photo-1540575467063-17e6fc48db44?auto=format&fit=crop&q=80&w=2000"
}: RoadshowBlockProps) {
  return (
    <section className="relative py-32 overflow-hidden bg-zinc-950 text-white">
      {/* Dynamic Background with Blur */}
      <div className="absolute inset-0 z-0">
          <Image 
            src={imageUrl} 
            alt="Event Background" 
            fill 
            className="object-cover opacity-20 blur-xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/40" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="lg:col-span-7 space-y-10"
            >
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white text-sm font-medium backdrop-blur-md">
                    <Ticket className="h-4 w-4 text-yellow-400" />
                    <span className="w-px h-4 bg-white/20" />
                    Limited Tickets Available
                </div>
                
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
                    {eventName} <br/> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Live in {city}</span>
                </h2>
                
                <p className="text-xl text-zinc-400 leading-relaxed max-w-xl">
                    {description}
                </p>

                <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                    <div className="flex items-start gap-4 group">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5 group-hover:bg-white/10 transition-colors">
                            <CalendarDays className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-zinc-400 uppercase tracking-wider mb-1">Dates</p>
                            <p className="text-lg font-medium">{date}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4 group">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5 group-hover:bg-white/10 transition-colors">
                            <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-zinc-400 uppercase tracking-wider mb-1">Time</p>
                            <p className="text-lg font-medium">{time}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4 sm:col-span-2 group">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5 group-hover:bg-white/10 transition-colors">
                            <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-zinc-400 uppercase tracking-wider mb-1">Venue</p>
                            <p className="text-lg font-medium">{venue}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button size="lg" className="h-14 px-8 text-lg bg-white text-black hover:bg-zinc-200 rounded-full font-semibold shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:scale-105 transition-all">
                        Register Now Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/20 text-white hover:bg-white/10 hover:border-white/40">
                        Download Event Guide
                    </Button>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="lg:col-span-5 relative"
            >
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 relative group">
                    <Image 
                        src={imageUrl} 
                        alt="Event Main" 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                         <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800 relative overflow-hidden">
                                            <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Attendee" fill />
                                        </div>
                                    ))}
                                </div>
                                <div className="font-medium">
                                    <span className="font-bold text-lg block">500+</span>
                                    <span className="text-xs opacity-70">Attending</span>
                                </div>
                             </div>
                             <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                                 <Star className="h-5 w-5 text-white fill-white" />
                             </div>
                         </div>
                     </div>
                </div>
                
                {/* Floating "Live" Badge */}
                <div className="absolute top-6 right-6 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full" />
                    LIVE EVENT
                </div>
            </motion.div>

        </div>
      </div>
    </section>
  );
}
