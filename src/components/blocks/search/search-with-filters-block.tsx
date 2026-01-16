
'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Home, DollarSign, Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchWithFiltersBlockProps {
  headline?: string;
  subtext?: string;
}

export function SearchWithFiltersBlock({
  headline = "Find Your Perfect Property",
  subtext = "Use this advanced filters to browse thousands of properties in the UAE."
}: SearchWithFiltersBlockProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceRange, setPriceRange] = useState([1000000]);

  return (
    <section className="py-12 bg-white border-b sticky top-14 z-20 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by community, building, or project..." 
                        className="pl-10 h-12"
                    />
                </div>
                
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Select>
                        <SelectTrigger className="w-[140px] h-12">
                            <SelectValue placeholder="Buy / Rent" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="buy">Buy</SelectItem>
                            <SelectItem value="rent">Rent</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select>
                        <SelectTrigger className="w-[160px] h-12">
                            <SelectValue placeholder="Property Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="villa">Villa</SelectItem>
                            <SelectItem value="townhouse">Townhouse</SelectItem>
                            <SelectItem value="penthouse">Penthouse</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button 
                        variant={showAdvanced ? "secondary" : "outline"} 
                        className="h-12 gap-2"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>
                    
                    <Button size="lg" className="h-12 px-8">Search</Button>
                </div>
            </div>

            {showAdvanced && (
                <div className="p-6 bg-muted/30 rounded-xl border animate-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold">Advanced Filters</h4>
                        <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(false)}><X className="h-4 w-4" /></Button>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span>Max Price</span>
                                <span className="font-medium text-primary">AED {priceRange[0].toLocaleString()}</span>
                            </div>
                            <Slider 
                                value={priceRange} 
                                max={50000000} 
                                step={500000} 
                                onValueChange={setPriceRange} 
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>0</span>
                                <span>50M+</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-sm font-medium">Bedrooms</span>
                            <div className="flex gap-2">
                                {["Studio", "1", "2", "3", "4", "5+"].map((bed) => (
                                    <Button key={bed} variant="outline" size="sm" className="flex-1 hover:bg-primary hover:text-primary-foreground">{bed}</Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-sm font-medium">Amenities</span>
                            <div className="flex flex-wrap gap-2">
                                {["Pool", "Gym", "Balcony", "Parking", "Sea View", "Furnished"].map((amenity) => (
                                    <Badge key={amenity} variant="secondary" className="cursor-pointer hover:bg-primary/20">{amenity}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </section>
  );
}
