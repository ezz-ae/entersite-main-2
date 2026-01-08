
'use client';

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import type { ProjectData } from "@/lib/types";
import { motion } from "framer-motion";
import { searchProjects } from "@/lib/project-service";
import { verifyAndFetchAssets } from "@/lib/media-scraper"; 
import { ProjectCard } from "@/components/project-card";

interface ListingGridBlockProps {
  headline?: string;
  subtext?: string;
  initialFilter?: { city?: string, developer?: string, status?: string }; // Expanded filter options
  projects?: ProjectData[]; // Can be pre-populated by template
}

export function ListingGridBlock({
    headline = "Featured Properties",
    subtext = "Discover our handpicked selection of premium real estate opportunities.",
    initialFilter = {},
    projects: initialProjects = []
}: ListingGridBlockProps) {
  
  const [projects, setProjects] = useState<ProjectData[]>(initialProjects);
  const [loading, setLoading] = useState(initialProjects.length === 0);
  const [searchQuery, setSearchQuery] = useState("");

  const loadProjects = useCallback(async (query = "", filters = initialFilter) => {
      setLoading(true);
      try {
          const rawResults = await searchProjects(query, filters);
          
          const cleanedResults = await Promise.all(rawResults.slice(0, 6).map(async (p) => {
              const cleanAssets = await verifyAndFetchAssets(p.name, p.images);
              
              return {
                  ...p,
                  images: cleanAssets.heroImages.concat(cleanAssets.galleryImages),
                  developer: cleanAssets.developerName || p.developer
              };
          }));

          setProjects(cleanedResults);
      } catch (error) {
          console.error("Failed to load projects", error);
      } finally {
          setLoading(false);
      }
  }, [initialFilter]);

  // Only run on initial mount if no projects are provided
  useEffect(() => {
      if (initialProjects.length === 0) {
          loadProjects();
      }
  }, [initialProjects.length, loadProjects]);

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      loadProjects(searchQuery);
  }

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">{headline}</h2>
                <p className="text-lg text-muted-foreground font-light max-w-xl">{subtext}</p>
            </div>
            
            <form onSubmit={handleSearch} className="relative w-full md:w-72">
                <Input 
                    placeholder="Search projects..." 
                    className="pl-10 h-12 bg-muted/30 border-muted-foreground/10 rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
            </form>
        </div>

        {loading ? (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-lg text-muted-foreground">Loading projects...</span>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
            ))}
            </div>
        )}
      </div>
    </section>
  );
}
