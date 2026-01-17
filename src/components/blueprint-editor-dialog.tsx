'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Blueprint {
  title: string;
  description: string;
}

interface BlueprintEditorDialogProps {
  open: boolean;
  blueprint: Blueprint | null;
  onOpenChange: (open: boolean) => void;
  onGenerate: (description: string) => void;
  onSwitchToTemplates: () => void;
}

export function BlueprintEditorDialog({ 
  open, 
  blueprint, 
  onOpenChange, 
  onGenerate,
  onSwitchToTemplates
}: BlueprintEditorDialogProps) {
  const [editedDescription, setEditedDescription] = useState('');

  useEffect(() => {
    if (blueprint) {
      setEditedDescription(blueprint.description);
    }
  }, [blueprint]);

  if (!blueprint) return null;

  const handleGenerateClick = () => {
    onGenerate(editedDescription);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Customize Your Blueprint</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="blueprint-title" className="text-zinc-400">Blueprint Title</Label>
            <p id="blueprint-title" className="font-semibold text-lg">{blueprint.title}</p>
          </div>
          <div>
            <Label htmlFor="blueprint-description" className="text-zinc-400">Project Description</Label>
            <Textarea
              id="blueprint-description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="min-h-[150px] bg-zinc-950 border-zinc-700 mt-2 text-base focus-visible:ring-blue-500"
              rows={6}
            />
             <p className="text-xs text-zinc-500 mt-2">Feel free to edit the description to better match your vision. The Smart builder will use this to craft your site.</p>
          </div>
         
        </div>
        <DialogFooter className="sm:justify-between flex-col-reverse sm:flex-row gap-4">
            <div className="flex items-center gap-2 text-sm text-left">
                <p className="text-zinc-400">
                    Prefer a visual start? <Button variant="link" className="p-0 h-auto text-green-400 hover:text-green-300" onClick={onSwitchToTemplates}>Use a template instead.</Button>
                </p>
            </div>
            <div className="flex justify-end gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button onClick={handleGenerateClick} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create Site
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
