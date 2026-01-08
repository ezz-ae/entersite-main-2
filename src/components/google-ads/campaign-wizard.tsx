'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowRight, ArrowLeft, Target, MapPin, Sparkles, Pencil, BarChart2, Check, Circle, Trash2 } from 'lucide-react';
import { apiFetch } from '@/lib/apiFetch';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';

const steps = ['Goal', 'Targeting', 'Keywords', 'Ad Creative', 'Budget', 'Launch'];

// Mock data for goals
const goals = [
  { name: 'Lead Generation', icon: Target },
  { name: 'Brand Awareness', icon: BarChart2 },
  { name: 'Website Traffic', icon: MapPin },
];

export function CampaignWizard({ onCampaignCreated }: { onCampaignCreated: (campaign: any) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({ budget: 50 });
  const [keywords, setKeywords] = useState<any[]>([]);
  const [isFetchingKeywords, setIsFetchingKeywords] = useState(false);
  const { toast } = useToast();

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleUpdateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFetchKeywords = async () => {
    setIsFetchingKeywords(true);
    try {
      const res = await apiFetch('/api/google-ads/keywords');
      const data = await res.json();
      if (res.ok) {
        setKeywords(data);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Could not fetch keywords.' });
    } finally {
      setIsFetchingKeywords(false);
    }
  };

  const handleLaunch = async () => {
    setIsLoading(true);
    const finalData = { ...formData, keywords };
    try {
      const res = await apiFetch('/api/google-ads/campaigns', {
        method: 'POST',
        body: JSON.stringify(finalData),
      });
      const newCampaign = await res.json();
      if (res.ok) {
        toast({ title: 'Campaign Launched!', description: 'Your new campaign is now live.' });
        onCampaignCreated(newCampaign);
      } else {
        toast({ title: 'Error', description: 'Could not launch campaign.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Could not launch campaign.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Goal
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {goals.map(goal => (
              <Card 
                key={goal.name} 
                className={`cursor-pointer ${formData.goal === goal.name ? 'border-blue-500' : ''}`}
                onClick={() => handleUpdateForm('goal', goal.name)}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <goal.icon className="h-8 w-8 mb-2" />
                  <p className="font-semibold">{goal.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case 1: // Targeting
        return (
          <div>
            <Input 
              placeholder="Enter target location (e.g., Dubai, UAE)"
              onChange={(e) => handleUpdateForm('location', e.target.value)}
              value={formData.location || ''}
            />
            {/* Mock map */}
            <div className="mt-4 h-64 bg-zinc-800 rounded-lg flex items-center justify-center">
              <p className="text-zinc-500">Map Preview</p>
            </div>
          </div>
        );
      case 2: // Keywords
        return (
          <div>
            <div className="flex gap-2 mb-4">
              <Input placeholder="Describe your product or service" />
              <Button onClick={handleFetchKeywords} disabled={isFetchingKeywords}>
                {isFetchingKeywords ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate
              </Button>
            </div>
            <div className="space-y-2">
              {keywords.map((kw, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-zinc-800 rounded-lg">
                  <span>{kw.keyword} <span className="text-xs text-zinc-500">({kw.matchType})</span></span>
                  <Button variant="ghost" size="icon" onClick={() => setKeywords(kws => kws.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </div>
        );
      case 3: // Ad Creative
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Input placeholder="Headline 1" className="mb-2" onChange={(e) => handleUpdateForm('headline1', e.target.value)} />
              <Input placeholder="Headline 2" className="mb-2" onChange={(e) => handleUpdateForm('headline2', e.target.value)} />
              <Textarea placeholder="Description" onChange={(e) => handleUpdateForm('description', e.target.value)} />
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-bold text-blue-500">{formData.headline1 || 'Headline 1'} | {formData.headline2 || 'Headline 2'}</p>
              <p className="text-sm">{formData.description || 'This is where your ad description will appear.'}</p>
              <p className="text-xs text-green-500 mt-1">Ad Preview</p>
            </div>
          </div>
        );
      case 4: // Budget
        return (
          <div>
            <p className="mb-2">Daily Budget: ${formData.budget}</p>
            <Slider 
              defaultValue={[50]} 
              max={1000} 
              step={10} 
              onValueChange={([val]) => handleUpdateForm('budget', val)} 
            />
          </div>
        );
      case 5: // Launch
        return (
          <div>
            <h3 className="font-bold mb-4">Review Campaign</h3>
            <p><strong>Goal:</strong> {formData.goal}</p>
            <p><strong>Location:</strong> {formData.location}</p>
            <p><strong>Keywords:</strong> {keywords.length}</p>
            <p><strong>Daily Budget:</strong> ${formData.budget}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Campaign</CardTitle>
        <CardDescription>Step {currentStep + 1} of {steps.length}: {steps[currentStep]}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="min-h-[300px]">
          {renderStepContent()}
        </div>
        <div className="flex justify-between mt-8">
          <Button onClick={handlePrev} variant="outline" disabled={currentStep === 0 || isLoading}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          {currentStep === steps.length - 1 ? (
            <Button onClick={handleLaunch} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Launch Campaign
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
