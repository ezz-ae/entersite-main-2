'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowLeft, Building, User, FileText, Bot, LayoutTemplate, UploadCloud, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const projectCategories = [
  {
    key: 'brochure',
    title: "Convert a Brochure",
    icon: FileText,
    desc: "The fastest way to build. Upload a project PDF and we'll do the rest.",
    action: "Upload PDF",
    isPrimary: true
  },
  {
    key: 'agent',
    title: "Personal Portfolio",
    icon: User,
    desc: "Build a high-end site for yourself or your real estate team.",
    action: "Select",
    isPrimary: false
  },
  {
    key: 'campaign',
    title: "Specific Launch",
    icon: Sparkles,
    desc: "A single-page engine for an upcoming property launch.",
    action: "Select",
    isPrimary: false
  },
];

interface BuilderLandingPageProps {
  onStartWithAI: (initialPrompt: string) => void;
  onChooseTemplate: () => void;
}

export function BuilderLandingPage({ onStartWithAI, onChooseTemplate }: BuilderLandingPageProps) {
  const [step, setStep] = useState('category');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
    if (category.key === 'brochure') {
      setStep('options');
    } else {
      onChooseTemplate();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFile(null);
  };

  if (step === 'category') {
    return <CategorySelectionScreen onSelect={handleCategorySelect} />;
  }

  return (
      <div className="min-h-screen w-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-2xl text-center space-y-6 sm:space-y-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                  <UploadCloud className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Upload Project Brochure</h1>
              <p className="text-zinc-400 text-base sm:text-lg">Drop your PDF here. We will pull the key details and build your page.</p>
              
              <label htmlFor="pdf-upload" className="border-2 border-dashed border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-12 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group block">
                  <input id="pdf-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf"/>
                  {file ? (
                    <div className="flex flex-col items-center gap-4">
                      <FileText className="h-12 w-12 text-blue-500" />
                      <p className="text-white font-medium">{file.name}</p>
                      <Button size="sm" variant="destructive" onClick={handleRemoveFile} className="bg-red-500/10 text-red-400 hover:bg-red-500/20">
                          <X className="h-4 w-4 mr-2" />
                          Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                        <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-zinc-600 group-hover:text-blue-500 transition-colors" />
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Drag & Drop PDF or Click to Browse</p>
                    </div>
                  )}
              </label>

              <div className="pt-8 flex flex-col gap-4">
                  <Button onClick={() => onStartWithAI("Built from brochure")} className="h-14 sm:h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base sm:text-lg w-full" disabled={!file}>
                      Build from Brochure
                  </Button>
                  <button onClick={() => setStep('category')} className="text-zinc-500 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors">
                      Cancel & Go Back
                  </button>
              </div>
          </div>
      </div>
  )
}

function CategorySelectionScreen({ onSelect }: { onSelect: (cat: any) => void; }) {
  return (
    <div className="min-h-screen w-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 sm:p-8">
      <div className="text-center mb-12 sm:mb-16 space-y-4">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight">Choose how to start.</h1>
        <p className="text-zinc-500 text-base sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">Select a starting point. We guide you step by step.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl w-full">
        {projectCategories.map(cat => (
          <button key={cat.key} onClick={() => onSelect(cat)} className="text-left group">
            <Card className={cn(
                "bg-zinc-900/50 border-white/5 backdrop-blur-3xl hover:border-blue-500/50 transition-all duration-500 flex flex-col p-6 sm:p-8 h-full rounded-[2rem] sm:rounded-[2.5rem]",
                cat.isPrimary && "border-blue-500/30 bg-blue-500/5 shadow-[0_0_50px_-10px_rgba(59,130,246,0.2)]"
            )}>
              <div className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-6",
                  cat.isPrimary ? "bg-blue-600 text-white" : "bg-white/5 text-zinc-400 group-hover:text-white group-hover:bg-blue-600/10 transition-all"
              )}>
                <cat.icon className="h-5 w-5 sm:h-7 sm:w-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">{cat.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed flex-grow">{cat.desc}</p>
              <div className="text-blue-500 font-bold uppercase tracking-widest text-xs flex items-center mt-8 group-hover:gap-2 transition-all">
                {cat.action} <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
