'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { SitePage } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleAdsManager } from "@/components/ads/google-ads-manager";

interface SeoSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: SitePage;
  onSave: (seoData: SitePage['seo']) => void;
}

export function SeoSettingsDialog({ open, onOpenChange, page, onSave }: SeoSettingsDialogProps) {
  const [title, setTitle] = useState(page.seo.title);
  const [description, setDescription] = useState(page.seo.description);
  const [keywords, setKeywords] = useState<string[]>(page.seo.keywords || []);
  const [currentKeyword, setCurrentKeyword] = useState("");

  // Reset state when page changes
  useEffect(() => {
    setTitle(page.seo.title);
    setDescription(page.seo.description);
    setKeywords(page.seo.keywords || []);
  }, [page, open]);

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentKeyword.trim()) {
      e.preventDefault();
      if (!keywords.includes(currentKeyword.trim())) {
        setKeywords([...keywords, currentKeyword.trim()]);
      }
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleSave = () => {
    onSave({
      title,
      description,
      keywords,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col p-0 overflow-hidden">
        <div className="p-6 pb-2 border-b">
            <DialogHeader>
            <DialogTitle>Marketing & SEO</DialogTitle>
            <DialogDescription>
                Manage your organic search presence and paid advertising campaigns.
            </DialogDescription>
            </DialogHeader>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
            <Tabs defaultValue="seo" className="w-full h-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="seo">SEO Settings</TabsTrigger>
                    <TabsTrigger value="ads">Google Ads</TabsTrigger>
                </TabsList>

                <TabsContent value="seo" className="space-y-6">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Meta Title</Label>
                            <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Luxury Apartments in Dubai Marina | Emaar"
                            />
                            <p className="text-[10px] text-muted-foreground text-right">
                            Recommended: 50-60 characters ({title.length})
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Meta Description</Label>
                            <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Discover exclusive waterfront living at... Book your viewing today."
                            className="h-24 resize-none"
                            />
                            <p className="text-[10px] text-muted-foreground text-right">
                            Recommended: 150-160 characters ({description.length})
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="keywords">Keywords</Label>
                            <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-background min-h-[40px]">
                            {keywords.map((keyword) => (
                                <Badge key={keyword} variant="secondary" className="gap-1">
                                {keyword}
                                <X
                                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                                    onClick={() => removeKeyword(keyword)}
                                />
                                </Badge>
                            ))}
                            <input
                                className="flex-1 bg-transparent border-none outline-none text-sm min-w-[100px]"
                                placeholder="Type and press Enter..."
                                value={currentKeyword}
                                onChange={(e) => setCurrentKeyword(e.target.value)}
                                onKeyDown={handleAddKeyword}
                            />
                            </div>
                        </div>
                        
                        <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
                            <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Search Preview</h4>
                            <div className="font-sans">
                                <div className="text-sm text-[#202124] flex items-center gap-1 mb-1">
                                    <span className="bg-[#f1f3f4] rounded-full w-4 h-4 inline-block mr-1"></span>
                                    <span>entresite.ai</span>
                                    <span className="text-muted-foreground">› projects › dubai</span>
                                </div>
                                <div className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate font-medium">
                                    {title || "Page Title"}
                                </div>
                                <div className="text-sm text-[#4d5156] line-clamp-2 mt-1">
                                    {description || "No description provided."}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button onClick={handleSave}>Save SEO Settings</Button>
                    </div>
                </TabsContent>

                <TabsContent value="ads" className="h-full">
                    <GoogleAdsManager pageTitle={title} pageDescription={description} />
                </TabsContent>
            </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
