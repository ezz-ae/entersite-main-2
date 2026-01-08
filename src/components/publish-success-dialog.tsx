'use client';

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, ExternalLink, Globe, Share2, ShieldCheck, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { publishSite } from "@/lib/publish-service";
import { AuthError } from "@/lib/auth-fetch";
import Link from "next/link";
import type { SitePage } from '@/lib/types';
import confetti from 'canvas-confetti';

interface PublishSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: SitePage;
}

export function PublishSuccessDialog({ 
    open, 
    onOpenChange,
    page
}: PublishSuccessDialogProps) {
  const { toast } = useToast();
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [publishedUrl, setPublishedUrl] = React.useState("");
  const [siteId, setSiteId] = React.useState("");

  const handlePublish = React.useCallback(async () => {
      setIsPublishing(true);
      try {
          const result = await publishSite(page);
          setPublishedUrl(result.publishedUrl);
          setSiteId(result.siteId);
          
          // Trigger confetti on success
          const duration = 3 * 1000;
          const animationEnd = Date.now() + duration;
          const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

          const random = (min: number, max: number) => Math.random() * (max - min) + min;

          const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
              return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
          }, 250);

      } catch (error) {
          console.error("Failed to publish", error);
          toast({
              title: error instanceof AuthError ? "Sign in required" : "Error",
              description: error instanceof AuthError
                ? "Please sign in to publish your site."
                : "Failed to publish site. Please try again.",
              variant: "destructive"
          });
      } finally {
          setIsPublishing(false);
      }
  }, [page, toast]);

  React.useEffect(() => {
      if (open && !publishedUrl) {
          handlePublish();
      }
  }, [handlePublish, open, publishedUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(publishedUrl);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl text-center p-0 overflow-hidden bg-zinc-950 border-white/10 text-white rounded-[2.5rem]">
        
        {isPublishing ? (
            <div className="py-24 space-y-8 flex flex-col items-center">
                <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-4 border-t-4 border-blue-500/20 rounded-full animate-spin reverse"></div>
                    <Globe className="absolute inset-0 m-auto h-12 w-12 text-blue-500 animate-pulse" />
                </div>
                <div>
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">Getting Your Link Ready...</h3>
                    <p className="text-zinc-500 text-lg font-light mt-2">This takes a few seconds</p>
                </div>
            </div>
        ) : (
            <div className="animate-in fade-in zoom-in duration-700">
                <div className="p-12 bg-gradient-to-b from-blue-600/10 to-transparent">
                    <div className="mx-auto w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                        <CheckCircle2 className="h-12 w-12 text-white stroke-[3px]" />
                    </div>
                    
                    <DialogHeader>
                        <DialogTitle className="text-5xl font-black tracking-tighter text-center italic uppercase leading-none">Your Link Is Live.</DialogTitle>
                        <DialogDescription className="text-center text-xl font-light mt-4 max-w-sm mx-auto text-zinc-400 leading-relaxed">
                            Share this link with clients and start collecting leads.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="px-12 pb-12 space-y-8">
                    <div className="bg-black border border-white/10 p-1.5 rounded-[2rem] flex items-center shadow-2xl">
                        <div className="flex-1 px-6 py-4 text-lg font-medium text-left truncate text-zinc-300">
                            {publishedUrl}
                        </div>
                        <Button size="lg" onClick={handleCopy} className="rounded-full h-14 px-8 bg-white text-black font-bold hover:bg-zinc-200">
                            <Copy className="h-5 w-5 mr-2" />
                            Copy URL
                        </Button>
                    </div>
                    <p className="text-xs text-zinc-500">
                        Want your own domain? Connect it in <Link href="/dashboard/domain" className="text-white underline">Domains</Link>.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <Button 
                            variant="outline" 
                            className="w-full h-16 rounded-2xl text-lg font-bold border-white/10 bg-white/5 hover:bg-white/10" 
                            onClick={() => window.open(publishedUrl || `${window.location.origin}/p/${siteId}`, '_blank')}
                            disabled={!publishedUrl && !siteId}
                        >
                            <ExternalLink className="mr-2 h-5 w-5" />
                            Open Site
                        </Button>
                        <Button
                          className="w-full h-16 rounded-2xl text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-900/40"
                          onClick={handleCopy}
                          disabled={!publishedUrl}
                        >
                            <Share2 className="mr-2 h-5 w-5" />
                            Copy Link
                        </Button>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-zinc-900/50 border border-white/5 text-left">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center flex-shrink-0">
                                <Zap className="h-5 w-5 text-orange-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-widest">Next Step: Promote Your Listing</h4>
                                <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                                    This project is ready for traffic. Start a launch campaign with a small daily budget to get more views.
                                </p>
                                <Button size="sm" className="mt-4 h-9 rounded-lg bg-white text-black font-bold text-xs px-6" asChild>
                                    <Link href="/dashboard/google-ads">Start Ad Plan</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-center gap-6 pt-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                            <ShieldCheck className="h-4 w-4 text-blue-500" /> SSL SECURED
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                            <Globe className="h-4 w-4 text-blue-500" /> FAST WORLDWIDE
                        </div>
                    </div>
                </div>
                
                <div className="bg-white/5 py-6 border-t border-white/5">
                    <button 
                        className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors"
                        onClick={() => onOpenChange(false)}
                    >
                        Back to Editor
                    </button>
                </div>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
