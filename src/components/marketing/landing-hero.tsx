'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { captureLead } from '@/lib/leads';
import { useCampaignAttribution } from '@/hooks/useCampaignAttribution';

export function LandingHero() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const router = useRouter();
  const attribution = useCampaignAttribution();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsUploading(true);

    try {
      await captureLead({
        source: 'landing-hero',
        project: file.name,
        context: { page: 'landing', buttonId: 'hero-upload', service: 'builder' },
        attribution: attribution ?? undefined,
        tenantId: 'public',
      });
    } catch (error) {
      console.error('Failed to capture lead', error);
    }

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        // Here you would typically handle the file upload to the server
        // For now, we'll just redirect to the builder
        setTimeout(() => {
          router.push('/builder?mode=brochure-demo');
        }, 500);
      }
    }, 200);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden px-4 py-16 sm:py-20">
      
      {/* Background Intelligence */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(37,99,235,0.1),transparent_50%)] animate-pulse" />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 container mx-auto max-w-5xl text-center space-y-10 sm:space-y-12">
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
        >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500 mb-4">
                <Sparkles className="h-3 w-3" /> Brochure to Listing Page
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95]">
                Brochure to <br />
                <span className="text-blue-600">Listing Page.</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
                Upload your brochure and get a clean listing page ready to share with buyers.
            </p>
        </motion.div>

        {/* The "One Big Action" - File Upload */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="w-full max-w-2xl mx-auto"
        >
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf"
          />
          <div 
            onClick={handleUploadClick}
            className={cn(
                "relative group border-2 border-dashed rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 md:p-10 transition-all duration-500 cursor-pointer overflow-hidden",
                isUploading 
                  ? "border-blue-500 bg-blue-500/5" 
                  : "border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-white/10"
            )}
          >
            <AnimatePresence mode="wait">
              {!isUploading ? (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/40 group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold">Upload your brochure (PDF)</p>
                    <p className="text-zinc-500 font-medium text-sm sm:text-base">Any project, any developer. Preview in minutes.</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-500" /> Key Details</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-500" /> Floor Plans</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-500" /> Lead Form</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="uploading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-8 py-4"
                >
                  <div className="relative">
                    <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                  <div className="space-y-4 w-full max-w-xs">
                    <p className="text-lg sm:text-xl font-bold text-white">Reading your brochure...</p>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs font-mono text-zinc-500 uppercase tracking-widest">{uploadProgress}% Complete</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3 text-zinc-500">
            <span className="text-xs font-medium">Or start with a quick form</span>
            <ArrowRight className="h-3 w-3" />
            <Link href="/login" className="text-white font-bold text-xs hover:underline">Login without a brochure</Link>
         </div>
       </motion.div>
     </div>
   </section>
  );
}
