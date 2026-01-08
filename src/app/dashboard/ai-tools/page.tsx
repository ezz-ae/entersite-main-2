'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpertChatConfig } from '@/components/ai-tools/expert-chat-config';
import { GoogleAdsDashboard } from '@/components/ai-tools/google-ads-dashboard';
import { AudienceBuilderTool } from '@/components/ai-tools/audience-builder-tool';
import { ImageGenTool } from '@/components/ai-tools/image-gen-tool';
import { Bot, Megaphone, Users, Sparkles, ImageIcon } from 'lucide-react';

export default function AiToolsPage() {
  return (
    <div className="container mx-auto py-10 px-6 max-w-[1800px]">
      <div className="mb-12 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-600 to-red-700 flex items-center justify-center shadow-lg shadow-orange-900/20">
            <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
            <h1 className="text-4xl font-bold tracking-tight">AI OS Tools</h1>
            <p className="text-xl text-muted-foreground font-light">Advanced real estate intelligence at your fingertips.</p>
        </div>
      </div>

      <Tabs defaultValue="chat" className="space-y-10">
        <div className="border-b">
            <TabsList className="bg-transparent h-auto p-0 gap-8">
                <TabsTrigger value="chat" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-orange-600 rounded-none pb-4 px-0 h-auto text-lg font-medium transition-all gap-2">
                    <Bot className="h-5 w-5" /> Sales Chat Agent
                </TabsTrigger>
                <TabsTrigger value="images" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-orange-600 rounded-none pb-4 px-0 h-auto text-lg font-medium transition-all gap-2">
                    <ImageIcon className="h-5 w-5" /> Imagen 3 Studio
                </TabsTrigger>
                <TabsTrigger value="ads" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-orange-600 rounded-none pb-4 px-0 h-auto text-lg font-medium transition-all gap-2">
                    <Megaphone className="h-5 w-5" /> Google Ads Engine
                </TabsTrigger>
                <TabsTrigger value="audiences" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-orange-600 rounded-none pb-4 px-0 h-auto text-lg font-medium transition-all gap-2">
                    <Users className="h-5 w-5" /> Audience Architect
                </TabsTrigger>
            </TabsList>
        </div>

        <TabsContent value="chat" className="animate-in fade-in zoom-in-95 duration-500">
          <ExpertChatConfig />
        </TabsContent>

        <TabsContent value="images" className="animate-in fade-in zoom-in-95 duration-500">
          <ImageGenTool />
        </TabsContent>
        
        <TabsContent value="ads" className="animate-in fade-in zoom-in-95 duration-500">
          <GoogleAdsDashboard />
        </TabsContent>

        <TabsContent value="audiences" className="animate-in fade-in zoom-in-95 duration-500">
          <AudienceBuilderTool />
        </TabsContent>
      </Tabs>
    </div>
  );
}
