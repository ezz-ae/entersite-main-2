'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { 
  Bell, 
  Users,
  MessageSquare,
  Globe,
  Link2,
  Target,
  LayoutDashboard,
  CreditCard,
  Megaphone,
  ImageIcon,
  Palette,
  User
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import { EntrestateLogo } from "@/components/icons";
import { MobileBottomNav } from "@/components/mobile-app/mobile-bottom-nav";

const mainNavItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/sites", icon: Globe, label: "Sites" },
    { href: "/dashboard/domain", icon: Link2, label: "Web Address" },
    { href: "/dashboard/marketing", icon: Megaphone, label: "Marketing" },
    { href: "/dashboard/leads", icon: Target, label: "Leads" },
    { href: "/dashboard/chat-agent", icon: MessageSquare, label: "Chat" },
    { href: "/dashboard/assets", icon: ImageIcon, label: "Media" },
    { href: "/dashboard/brand", icon: Palette, label: "Brand" },
    { href: "/dashboard/team", icon: Users, label: "Team" },
];

const secondaryNavItems = [
    { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full bg-[#030303] text-zinc-100">
            {/* Master Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 hidden w-20 flex-col border-r border-white/5 bg-zinc-950 sm:flex">
                <div className="flex h-20 items-center justify-center border-b border-white/5">
                    <Link href="/">
                        <EntrestateLogo showText={false} className="scale-75" />
                    </Link>
                </div>
                
                <nav className="flex flex-col items-center gap-4 py-8 overflow-y-auto no-scrollbar">
                    <TooltipProvider delayDuration={0}>
                        {mainNavItems.map(item => (
                            <NavItem key={item.href} item={item} />
                        ))}
                    </TooltipProvider>
                </nav>
                
                <nav className="mt-auto flex flex-col items-center gap-4 py-8 border-t border-white/5">
                    <TooltipProvider delayDuration={0}>
                         {secondaryNavItems.map(item => (
                            <NavItem key={item.href} item={item} />
                        ))}
                    </TooltipProvider>
                </nav>
            </aside>

            {/* Main Area */}
            <div className="flex flex-1 flex-col sm:pl-20">
                 <header className="sticky top-0 z-40 flex h-20 items-center gap-4 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl px-8">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-white">Entrestate</span>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Region: Dubai</span>
                    </div>
                    
                    <div className="ml-auto flex items-center gap-6">
                        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">All Systems Go</span>
                        </div>
                        <Link href="/profile" className="hidden md:inline-flex">
                            <Button variant="ghost" size="sm" className="gap-2 text-zinc-400 hover:text-white hover:bg-white/5">
                                <User className="h-4 w-4" />
                                Profile
                            </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full relative transition-colors">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <UserNav />
                    </div>
                </header>

                <main className="flex-1 p-8 md:p-12 overflow-x-hidden pb-24 sm:pb-12">
                    {children}
                </main>
            </div>
            <div className="sm:hidden">
                <MobileBottomNav />
            </div>
        </div>
    );
}

function NavItem({ item }: { item: typeof mainNavItems[0] }) {
    const pathname = usePathname();
    const isActive = pathname === item.href;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link href={item.href} className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 relative group", 
                    isActive 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                        : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}>
                    <item.icon className="h-5 w-5" />
                    {isActive && (
                        <motion.div 
                            layoutId="active-nav-indicator"
                            className="absolute -left-2 w-1 h-6 bg-blue-600 rounded-r-full"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-zinc-900 border-white/10 text-white text-[10px] font-bold uppercase tracking-widest ml-2 px-3 py-1.5 rounded-lg shadow-2xl">
                {item.label}
            </TooltipContent>
        </Tooltip>
    );
}
