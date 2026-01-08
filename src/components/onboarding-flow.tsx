'use client';

import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Bot, Palette, Sparkles } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (data: any) => void;
  initialData?: any;
  onBack?: () => void;
}

export function OnboardingFlow({ onComplete, initialData = {}, onBack }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    brandColor: '#6366f1',
    ...initialData,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color: string) => {
    setFormData((prev: any) => ({ ...prev, brandColor: color }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Description formData={formData} handleChange={handleChange} nextStep={nextStep} onBack={onBack} />;
      case 2:
        return <Step2Branding formData={formData} handleChange={handleChange} handleColorChange={handleColorChange} prevStep={prevStep} onComplete={() => onComplete(formData)} />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800 text-white shadow-2xl">
      {renderStep()}
    </Card>
  );
}

// --- Step Components ---

const StepHeader = ({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) => (
    <CardHeader className="text-center">
        <div className="mx-auto bg-zinc-800 p-3 rounded-full mb-4 w-fit">{icon}</div>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <p className="text-zinc-400">{subtitle}</p>
    </CardHeader>
);

function Step1Description({ formData, handleChange, nextStep, onBack }: any) {
    const hasDescription = formData.projectDescription.trim().length > 5;
    return (
        <>
            <StepHeader 
                icon={<Bot className="h-6 w-6 text-zinc-300"/>}
                title="Describe Your Project"
                subtitle="Tell our AI what you want to build. Be as specific as you can!"
            />
            <CardContent className="px-6 py-0">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="projectName" className="text-zinc-400">Project Name</Label>
                        <Input 
                            id="projectName" 
                            name="projectName"
                            placeholder="e.g., Miami Waterfront Properties"
                            value={formData.projectName}
                            onChange={handleChange}
                            className="bg-zinc-950 border-zinc-700 mt-2 h-12 text-base focus-visible:ring-blue-500 text-white"
                        />
                    </div>
                    <div>
                        <Label htmlFor="projectDescription" className="text-zinc-400">Project Description</Label>
                        <Textarea
                            id="projectDescription"
                            name="projectDescription"
                            value={formData.projectDescription}
                            onChange={handleChange}
                            placeholder="e.g., A luxury real estate site for waterfront homes in Miami, featuring a gallery, map, and agent profiles."
                            className="min-h-[150px] bg-zinc-950 border-zinc-700 mt-2 text-base focus-visible:ring-blue-500 text-white"
                            rows={6}
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-6 flex justify-between">
                {onBack ? (
                    <Button variant="ghost" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-2"/> Back</Button>
                ) : <div/>}
                <Button onClick={nextStep} disabled={!hasDescription} className="bg-blue-600 hover:bg-blue-700 text-white">Continue <ArrowRight className="h-4 w-4 ml-2"/></Button>
            </CardFooter>
        </>
    );
}

const colorSwatches = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

function Step2Branding({ formData, handleChange, handleColorChange, prevStep, onComplete }: any) {
  return (
    <>
        <StepHeader 
            icon={<Palette className="h-6 w-6 text-zinc-300"/>}
            title="Add Your Branding"
            subtitle="Customize the look and feel of your site."
        />
        <CardContent className="px-6">
            <div className="space-y-6">
                <div>
                    <Label className="text-zinc-400">Primary Color</Label>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full border-2 border-zinc-600" style={{ backgroundColor: formData.brandColor }}/>
                        </div>
                        <div className="flex gap-2">
                            {colorSwatches.map(color => (
                                <button key={color} onClick={() => handleColorChange(color)} className={`w-8 h-8 rounded-full transition-all duration-150 \${formData.brandColor === color ? 'ring-2 ring-offset-2 ring-offset-zinc-900 ring-white' : ''}`} style={{backgroundColor: color}} />
                            ))}
                        </div>
                         <Input 
                            type="text"
                            value={formData.brandColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 w-28 h-10 text-white"
                        />
                    </div>
                </div>
            </div>
        </CardContent>
        <CardFooter className="p-6 flex justify-between">
            <Button variant="ghost" onClick={prevStep}><ArrowLeft className="h-4 w-4 mr-2"/> Back</Button>
            <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700 text-white">
                <Sparkles className="h-4 w-4 mr-2"/> Build My Site
            </Button>
        </CardFooter>
    </>
  );
}
