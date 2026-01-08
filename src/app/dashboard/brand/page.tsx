'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Palette, Type, Save } from 'lucide-react';
import Image from 'next/image';

const colorPalettes = [
    { name: 'Luxury Black/Gold', primary: '#D4AF37', background: '#111111', accent: '#F5F5F5' },
    { name: 'Corporate Blue', primary: '#3B82F6', background: '#F9FAFB', accent: '#1F2937' },
    { name: 'Modern Teal', primary: '#14B8A6', background: '#FFFFFF', accent: '#4B5563' },
    { name: 'Minimalist White', primary: '#1F2937', background: '#FFFFFF', accent: '#E5E7EB' },
]

export default function BrandDashboardPage() {
    const [selectedPalette, setSelectedPalette] = useState(colorPalettes[0]);
    const [logo, setLogo] = useState<string | null>("https://upload.wikimedia.org/wikipedia/commons/a/ab/Emaar_Logo.svg");

    return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Brand Kit</h1>
                        <p className="text-muted-foreground">Manage your company's visual identity for all generated sites.</p>
                    </div>
                    <Button className="gap-2">
                        <Save className="h-4 w-4" /> Save Brand Kit
                    </Button>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Color & Logo Settings */}
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Logo</CardTitle>
                                <CardDescription>Upload your company logo.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full aspect-video bg-muted/20 border-2 border-dashed rounded-xl flex items-center justify-center">
                                    {logo ? (
                                        <div className="relative w-40 h-20">
                                            <Image src={logo} alt="Company Logo" fill className="object-contain" />
                                        </div>
                                    ) : (
                                        <div className="text-center text-muted-foreground">
                                            <Upload className="h-8 w-8 mx-auto mb-2" />
                                            <p className="text-sm font-medium">Click to upload</p>
                                        </div>
                                    )}
                                </div>
                                <Button variant="outline" className="w-full mt-4">
                                    {logo ? "Change Logo" : "Upload Logo"}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Color Palette</CardTitle>
                                <CardDescription>Choose a base palette or customize your brand colors.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    {colorPalettes.map(palette => (
                                        <button 
                                            key={palette.name} 
                                            onClick={() => setSelectedPalette(palette)}
                                            className={`p-3 border-2 rounded-lg ${selectedPalette.name === palette.name ? 'border-primary' : 'border-border'}`}
                                        >
                                            <div className="flex gap-1 h-8">
                                                <div className="w-1/3 rounded-sm" style={{ backgroundColor: palette.primary }}></div>
                                                <div className="w-1/3 rounded-sm" style={{ backgroundColor: palette.background }}></div>
                                                <div className="w-1/3 rounded-sm border" style={{ backgroundColor: palette.accent }}></div>
                                            </div>
                                            <p className="text-xs font-medium mt-2">{palette.name}</p>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <Label>Primary</Label>
                                        <Input type="color" value={selectedPalette.primary} onChange={e => setSelectedPalette({...selectedPalette, primary: e.target.value})} className="p-1 h-10"/>
                                    </div>
                                    <div>
                                        <Label>Background</Label>
                                        <Input type="color" value={selectedPalette.background} onChange={e => setSelectedPalette({...selectedPalette, background: e.target.value})} className="p-1 h-10"/>
                                    </div>
                                    <div>
                                        <Label>Accent</Label>
                                        <Input type="color" value={selectedPalette.accent} onChange={e => setSelectedPalette({...selectedPalette, accent: e.target.value})} className="p-1 h-10"/>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Live Preview */}
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Live Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div 
                                className="aspect-[9/16] w-full max-w-[300px] mx-auto rounded-2xl border-4 border-foreground shadow-2xl overflow-hidden flex flex-col transition-colors duration-500"
                                style={{ backgroundColor: selectedPalette.background }}
                            >
                                <div className="p-4 flex justify-between items-center" style={{ color: selectedPalette.accent }}>
                                    {logo && <div className="relative w-16 h-5 invert"><Image src={logo} alt="Logo Preview" fill className="object-contain" /></div>}
                                    <div className="w-5 h-1 rounded-full" style={{ backgroundColor: selectedPalette.accent }}></div>
                                </div>
                                <div className="flex-1 p-4 space-y-3">
                                    <div className="h-16 rounded-lg" style={{ backgroundColor: selectedPalette.primary }}></div>
                                    <div className="space-y-1">
                                        <div className="h-3 w-3/4 rounded-full" style={{ backgroundColor: selectedPalette.accent, opacity: 0.8 }}></div>
                                        <div className="h-2 w-1/2 rounded-full" style={{ backgroundColor: selectedPalette.accent, opacity: 0.6 }}></div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="h-10 rounded-full" style={{ backgroundColor: selectedPalette.primary }}></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
    );
}
