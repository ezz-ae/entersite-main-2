'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ArrowRight, LifeBuoy, Menu, Target, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EntrestateLogo } from './icons';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { NAV_ITEMS } from '@/data/navigation';

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logOut } = useAuth();
  const loginHref = pathname ? `/login?returnTo=${encodeURIComponent(pathname)}` : '/login';

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
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 z-[100] w-full transition-all duration-500',
        isScrolled
          ? 'h-16 bg-black/80 backdrop-blur-2xl border-b border-white/10'
          : 'h-20 bg-transparent border-b border-transparent',
      )}
    >
      <div className="container h-full flex items-center justify-between px-4 md:px-6 max-w-[1800px]">
        <div className="flex items-center gap-10">
          <Link href="/market" className="group flex items-center gap-2">
            <EntrestateLogo className="scale-90" />
          </Link>

          <nav className="hidden xl:flex items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    className={cn(
                      'text-[10px] font-bold uppercase tracking-[0.22em] transition-all hover:text-white',
                      isActive ? 'text-white border-b border-white/40 pb-1' : 'text-zinc-500',
                    )}
                  >
                    {item.label}
                  </Link>
                  <div className="absolute left-0 top-full pt-6 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-all">
                    <div className="min-w-[620px] rounded-3xl border border-white/10 bg-zinc-950/95 backdrop-blur-2xl p-6 shadow-2xl">
                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                            Home
                          </p>
                          <Link
                            href={item.mega.home.href}
                            className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                          >
                            <p className="text-sm font-semibold text-white">{item.mega.home.label}</p>
                            <p className="text-xs text-zinc-500 mt-2">{item.mega.home.description}</p>
                          </Link>
                        </div>

                        <div className="space-y-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                            Work Area
                          </p>
                          <div className="space-y-2">
                            {item.mega.work.map((work) => (
                              <Link
                                key={work.href}
                                href={work.href}
                                className="block rounded-xl px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition"
                              >
                                {work.label}
                              </Link>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                            Docs
                          </p>
                          <Link
                            href={item.mega.docs.href}
                            className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                          >
                            <p className="text-sm font-semibold text-white">{item.mega.docs.label}</p>
                            <p className="text-xs text-zinc-500 mt-2">{item.mega.docs.description}</p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/account" className="hidden sm:block">
                <Button className="h-10 px-6 rounded-full bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10 group border-0">
                  Control Room <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/account/profile" className="hidden lg:block">
                <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full text-zinc-500 hover:text-white hover:bg-white/5">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </>
          ) : (
            <Link href={loginHref} className="hidden sm:block">
              <Button className="h-10 px-6 rounded-full bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10 group border-0">
                Continue <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
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
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[420px] z-[110] bg-zinc-950 border-l border-white/10 xl:hidden flex flex-col h-screen"
            >
              <div className="flex-1 overflow-y-auto px-6 pt-24 pb-12">
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-6 px-1">
                      Systems
                    </p>
                    <Accordion type="single" collapsible className="space-y-2">
                      {NAV_ITEMS.map((item) => (
                        <AccordionItem key={item.href} value={item.href} className="border-white/10">
                          <AccordionTrigger className="text-left text-sm font-semibold text-white hover:no-underline">
                            <span className="flex items-center gap-3">
                              <item.icon className="h-4 w-4 text-zinc-500" />
                              {item.label}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2">
                            <div className="space-y-2">
                              {item.mobile.map((link) => (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition"
                                >
                                  {link.label}
                                  <ArrowRight className="h-3 w-3 text-zinc-600" />
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-6 px-1">
                      Control
                    </p>
                    <div className="space-y-3">
                      <Link href={user ? '/account' : loginHref} className="block">
                        <div className="p-6 rounded-[1.5rem] bg-white text-black shadow-xl shadow-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <Target className="h-5 w-5" />
                            <ArrowRight className="h-4 w-4 opacity-50" />
                          </div>
                          <h4 className="text-lg font-bold tracking-tight">{user ? 'Control Room' : 'Continue'}</h4>
                          <p className="text-black/60 text-[10px] font-bold uppercase tracking-widest">
                            Control Room
                          </p>
                        </div>
                      </Link>
                      <div className="grid grid-cols-2 gap-3">
                        {user && (
                          <Link
                            href="/account/profile"
                            className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2"
                          >
                            <User className="h-5 w-5 text-zinc-500" />
                            <span className="text-xs font-bold text-zinc-300">Profile</span>
                          </Link>
                        )}
                        <Link
                          href="/support"
                          className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2"
                        >
                          <LifeBuoy className="h-5 w-5 text-zinc-500" />
                          <span className="text-xs font-bold text-zinc-300">Support</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-zinc-950/80 backdrop-blur-xl">
                {user ? (
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">
                      {(user.displayName || user.phoneNumber || user.email || 'US').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-xs truncate">
                        {user.displayName || user.phoneNumber || user.email?.split('@')[0]}
                      </p>
                      <p className="text-zinc-600 text-[10px] truncate">{user.phoneNumber || user.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-600"
                      onClick={handleLogOut}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Link href={loginHref}>
                    <Button className="w-full h-14 rounded-xl bg-white text-black font-bold text-sm uppercase tracking-widest shadow-xl border-0">
                      Continue
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
