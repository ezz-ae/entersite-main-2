'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, File, Image as ImageIcon, Folder } from 'lucide-react';

export default function AssetsDashboardPage() {
  return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Asset Library</h1>
                <p className="text-muted-foreground">Manage your images, documents, and brand files.</p>
            </div>
            <Button className="gap-2">
                <Upload className="h-4 w-4" /> Upload
            </Button>
        </div>

        <Tabs defaultValue="images" className="w-full">
            <TabsList>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="brand">Brand Assets</TabsTrigger>
            </TabsList>

            <TabsContent value="images" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="group relative aspect-square bg-muted rounded-xl overflow-hidden border hover:shadow-md transition-all">
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                <ImageIcon className="h-8 w-8 opacity-20" />
                            </div>
                            {/* Placeholder for real image */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Button variant="secondary" size="sm">View</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-6">
                <Card>
                    <CardContent className="p-0">
                        {[
                            { name: "Elysian_Brochure_v2.pdf", size: "4.5 MB", date: "Oct 12, 2025" },
                            { name: "Floor_Plans_Tower_A.pdf", size: "12 MB", date: "Oct 10, 2025" },
                            { name: "Price_List_Q4.xlsx", size: "1.2 MB", date: "Sep 28, 2025" },
                        ].map((doc, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded">
                                        <File className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{doc.name}</p>
                                        <p className="text-xs text-muted-foreground">{doc.size} • {doc.date}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">Download</Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

      </div>
  );
}
