'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { 
  Sparkles, 
  User, 
  Menu, 
  X, 
  ArrowRight, 
  Layout, 
  Globe, 
  Bot, 
  Target,
  Home,
  Layers,
  ChevronRight,
  Zap,
  Library,
  LifeBuoy,
  Search,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EntrestateLogo } from './icons';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';

const NAV_LINKS = [
    { href: "/instagram-assistant", label: "Instagram Assistant", icon: Bot, description: "Reply faster to buyer inquiries" },
    { href: "/google-ads", label: "Google Ads", icon: Search, description: "Run ads without the headache" },
    { href: "/audience-network", label: "Buyer Audience", icon: Users, description: "Pilot audience tools for brokers" },
    { href: "/discover", label: "Market Feed", icon: Library, description: "Project listings and market updates" },
    { href: "/docs", label: "Support", icon: LifeBuoy, description: "Help center & guides" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logOut } = useAuth();

  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header 
      className={cn(
        "fixed top-0 z-[100] w-full transition-all duration-500",
        isScrolled 
          ? "h-16 bg-black/80 backdrop-blur-2xl border-b border-white/10" 
          : "h-20 bg-transparent border-b border-transparent"
      )}
    >
      <div className="container h-full flex items-center justify-between px-4 md:px-6 max-w-[1800px]">
        
        <div className="flex items-center gap-10">
          <Link href="/" className="group flex items-center gap-2">
            <EntrestateLogo className="scale-90" />
          </Link>
          
          <nav className="hidden xl:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-white",
                  pathname === link.href ? "text-white border-b border-white/40 pb-1" : "text-zinc-500"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="hidden sm:block">
                  <Button className="h-10 px-6 rounded-full bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10 group border-0">
                      Dashboard <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
              </Link>
              <Link href="/profile" className="hidden lg:block">
                  <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full text-zinc-500 hover:text-white hover:bg-white/5">
                      <User className="h-5 w-5" />
                  </Button>
              </Link>
            </>
          ) : (
            <Link href="/start" className="hidden sm:block">
                <Button className="h-10 px-6 rounded-full bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10 group border-0">
                    Get Started <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
          )}

            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white transition-all z-[120]"
            >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-5 w-5" />}
            </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[105] xl:hidden"
            />
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-full sm:w-[400px] z-[110] bg-zinc-950 border-l border-white/10 xl:hidden flex flex-col h-screen"
            >
                <div className="flex-1 overflow-y-auto px-6 pt-24 pb-12">
                    <div className="space-y-10">
                        <div>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-6 px-1">Explore</p>
                            <nav className="flex flex-col gap-4">
                                {NAV_LINKS.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="group flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                                                pathname === link.href ? "bg-blue-600 border-blue-500 text-white" : "bg-zinc-900 border-white/5 text-zinc-500"
                                            )}>
                                                <link.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className={cn("text-lg font-bold tracking-tight", pathname === link.href ? "text-white" : "text-zinc-300")}>{link.label}</h4>
                                                <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">{link.description.slice(0, 30)}...</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-zinc-800" />
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-6 px-1">Quick Access</p>
                            <div className="space-y-3">
                                <Link href={user ? "/dashboard" : "/start"} className="block">
                                    <div className="p-6 rounded-[1.5rem] bg-blue-600 text-white shadow-xl shadow-blue-600/20 group">
                                        <div className="flex items-center justify-between mb-3">
                                            <Target className="h-5 w-5" />
                                            <ArrowRight className="h-4 w-4 opacity-50" />
                                        </div>
                                        <h4 className="text-lg font-bold tracking-tight">{user ? "Dashboard" : "Get Started"}</h4>
                                        <p className="text-blue-100/60 text-[10px] font-bold uppercase tracking-widest">Your Workspace</p>
                                    </div>
                                </Link>
                                <div className="grid grid-cols-2 gap-3">
                                    {user && (
                                      <Link href="/profile" className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                                          <User className="h-5 w-5 text-zinc-500" />
                                          <span className="text-xs font-bold text-zinc-300">Profile</span>
                                      </Link>
                                    )}
                                    <Link href="/docs" className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                                        <LifeBuoy className="h-5 w-5 text-zinc-500" />
                                        <span className="text-xs font-bold text-zinc-300">Help Center</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-zinc-950/80 backdrop-blur-xl">
                    {user ? (
                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                             <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                                {user.email?.substring(0, 2).toUpperCase()}
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="text-white font-bold text-xs truncate">{user.displayName || user.email?.split('@')[0]}</p>
                                <p className="text-zinc-600 text-[10px] truncate">{user.email}</p>
                             </div>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600" onClick={handleLogOut}>
                                <X className="h-4 w-4" />
                             </Button>
                        </div>
                    ) : (
                        <Link href="/start">
                            <Button className="w-full h-14 rounded-xl bg-white text-black font-bold text-sm uppercase tracking-widest shadow-xl border-0">
                                Get Started Free
                            </Button>
                        </Link>
                    )}
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
