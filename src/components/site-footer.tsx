'use client';

import React from 'react';
import Link from 'next/link';
import { EntrestateLogo } from '@/components/icons';
import { Twitter, Linkedin, Instagram, ArrowUpRight, Github, Globe, ShieldCheck, Zap } from 'lucide-react';

const PLATFORM_LINKS = [
    { href: "/instagram-assistant", label: "Instagram Assistant" },
    { href: "/google-ads", label: "Google Ads" },
    { href: "/audience-network", label: "Buyer Audience" },
];

const RESOURCE_LINKS = [
    { href: "/discover", label: "Market Feed" },
    { href: "/support", label: "Support" },
    { href: "/docs", label: "Guides" },
    { href: "/status", label: "System Status" },
    { href: "/start", label: "Get Started" },
];

export function SiteFooter() {
  return (
    <footer className="bg-black text-white border-t border-white/5 pb-12 pt-40">
      <div className="container mx-auto px-6 max-w-[1800px]">
        
        {/* Dynamic Watermark */}
        <div className="mb-40 overflow-hidden">
            <h2 className="text-[20vw] font-black leading-none tracking-tighter text-white/5 select-none -mb-[0.15em] whitespace-nowrap italic uppercase">
                ENTRESTATE
            </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-12 gap-16 md:gap-12 border-t border-white/5 pt-20">
          
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-4 flex flex-col justify-between">
            <div className="space-y-12">
                <Link href="/" className="hover:opacity-80 transition-opacity w-fit block">
                  <EntrestateLogo />
                </Link>
                <p className="text-zinc-500 max-w-sm leading-relaxed text-xl font-light">
                  The all-in-one platform for real estate professionals to design, market, and manage their properties with the power of AI.
                </p>
                <div className="flex gap-8">
                  <SocialLink href="#" icon={Twitter} />
                  <SocialLink href="#" icon={Linkedin} />
                  <SocialLink href="#" icon={Instagram} />
                </div>
            </div>
          </div>

          {/* Menus */}
          <div className="col-span-1 md:col-span-2 space-y-10">
            <h4 className="font-black text-[10px] text-zinc-600 uppercase tracking-[0.4em]">Platform</h4>
            <ul className="space-y-5 text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
              {PLATFORM_LINKS.map(link => (
                <li key={link.href}>
                    <Link href={link.href} className="hover:text-blue-500 transition-colors flex items-center gap-2 group">
                        {link.label} <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-10 border-r border-white/5 pr-8">
            <h4 className="font-black text-[10px] text-zinc-600 uppercase tracking-[0.4em]">Resources</h4>
            <ul className="space-y-5 text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
              {RESOURCE_LINKS.map(link => (
                <li key={link.href}>
                    <Link href={link.href} className="hover:text-white transition-colors flex items-center gap-2 group">
                        {link.label} <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Master Node Info */}
          <div className="col-span-2 md:col-span-4 flex flex-col justify-between items-end text-right space-y-12">
             <div className="p-8 rounded-3xl bg-blue-600/5 border border-blue-500/10 text-left w-full max-w-sm">
                <div className="flex items-center gap-2 text-blue-500 mb-4">
                    <Zap className="h-4 w-4 fill-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">System Status</span>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed font-medium mb-4">Core platform is online. Some features are still in pilot or setup mode.</p>
                <Link href="/status" className="text-white text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2">
                    Live Status Page <ArrowUpRight className="h-3 w-3" />
                </Link>
             </div>

             <div className="space-y-3">
                 <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Headquarters</p>
                 <p className="text-white text-sm font-black italic uppercase">Innovation Hub, DIFC</p>
                 <p className="text-zinc-600 text-sm font-medium">Dubai, UAE</p>
             </div>
             
             <div className="flex items-center gap-6 pt-4 border-t border-white/5 w-full justify-end">
                <div className="flex items-center gap-2 text-zinc-800 text-[9px] font-black uppercase tracking-widest">
                    <ShieldCheck className="h-3 w-3" /> SECURE
                </div>
                <div className="flex items-center gap-2 text-zinc-800 text-[9px] font-black uppercase tracking-widest">
                    <Globe className="h-3 w-3" /> FAST WORLDWIDE
                </div>
                <div className="text-zinc-800 text-[9px] font-black uppercase tracking-[0.6em]">
                    © 2024
                </div>
             </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon: Icon }: { href: string, icon: any }) {
  return (
    <Link href={href} className="text-zinc-700 hover:text-white transition-all hover:scale-110">
      <Icon className="h-6 w-6" strokeWidth={2.5} />
    </Link>
  )
}
