'use client';

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

interface BlogGridBlockProps {
  headline?: string;
  subtext?: string;
  posts?: BlogPost[];
}

export function BlogGridBlock({
  headline = "Real Estate Insights",
  subtext = "Stay updated with the latest market trends, investment tips, and community news.",
  posts = [
      { id: "1", title: "Why Off-Plan Properties in Dubai Offer High ROI", excerpt: "Exploring the benefits of investing in pre-construction projects and how to maximize your returns.", date: "Oct 12, 2025", category: "Investment", image: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?auto=format&fit=crop&q=80&w=800" },
      { id: "2", title: "Top 5 Family-Friendly Communities in 2025", excerpt: "A detailed guide to the best neighborhoods for families, featuring schools, parks, and safety ratings.", date: "Oct 08, 2025", category: "Communities", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&q=80&w=800" },
      { id: "3", title: "Understanding the New Golden Visa Rules", excerpt: "Everything you need to know about long-term residency through property investment in the UAE.", date: "Sep 28, 2025", category: "Legal", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800" },
  ]
}: BlogGridBlockProps) {
  return (
    <section className="py-20 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="max-w-2xl space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">{headline}</h2>
                <p className="text-lg text-muted-foreground">{subtext}</p>
            </div>
            <Button variant="outline">View All Articles</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden border-0 shadow-md group cursor-pointer h-full flex flex-col">
                    <div className="relative aspect-video overflow-hidden">
                        <Image 
                            src={post.image} 
                            alt={post.title} 
                            fill 
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <Badge className="absolute top-4 left-4 bg-white/90 text-black hover:bg-white">{post.category}</Badge>
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center text-xs text-muted-foreground mb-3 gap-2">
                            <Calendar className="h-3 w-3" />
                            {post.date}
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                        <div className="flex items-center text-primary font-medium text-sm mt-auto group-hover:translate-x-1 transition-transform">
                            Read More <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
