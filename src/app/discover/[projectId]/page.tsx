'use client';

import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { ProjectData } from '@/lib/types';
import { 
    Loader2, 
    Building, 
    MapPin, 
    DollarSign, 
    TrendingUp, 
    Calendar, 
    BarChart, 
    Home, 
    CheckCircle, 
    Info, 
    Phone, 
    Mail, 
    Globe
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

const ProjectDetailPage: NextPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'inventory_projects', projectId as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as ProjectData);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <p>Project not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div 
        className="h-[50vh] bg-cover bg-center relative flex items-end p-12"
        style={{ backgroundImage: `url(${project.images?.[0] || '/placeholder.jpg'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"/>
        <div className="relative z-10">
            <Badge className="mb-4 bg-blue-500 text-white">{project.project_status || 'Under Construction'}</Badge>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">{project.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-zinc-300">
                <div className="flex items-center gap-2"><Building className="h-5 w-5"/><span>{project.developer}</span></div>
                <div className="flex items-center gap-2"><MapPin className="h-5 w-5"/><span>{project.location.area}, {project.location.city}</span></div>
            </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl p-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
                <Card className="bg-zinc-900 border-white/10 rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold tracking-tight">Project Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-zinc-400">{project.description || 'No description available.'}</p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <InfoCard icon={DollarSign} label="Starting Price" value={project.price.label} />
                  <InfoCard icon={TrendingUp} label="Est. ROI" value={`${project.performance.roi}%`} />
                  <InfoCard icon={BarChart} label="Est. Growth" value={`${project.performance.growth}%`} />
                  <InfoCard icon={Calendar} label="Handover" value={project.handover.year} />
                </div>

                {project.payment_plan && (
                    <Card className="bg-zinc-900 border-white/10 rounded-2xl">
                        <CardHeader>
                            <CardTitle>Payment Plan</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ul className="space-y-3">
                            {Object.entries(project.payment_plan).map(([key, value]) => (
                                <li key={key} className="flex justify-between items-center bg-zinc-800 p-3 rounded-lg">
                                    <span className="font-semibold text-zinc-300">{key.replace('_', ' ')}</span>
                                    <span className="font-bold text-white">{value}</span>
                                </li>
                            ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

            </div>

            <div className="space-y-6">
                <Card className="bg-blue-600 text-white rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">Interested in this project?</h3>
                    <p className="text-blue-200 mb-6">Contact our sales team for a private consultation.</p>
                    <Button className="bg-white text-blue-600 hover:bg-zinc-200 w-full font-bold">Request a Call</Button>
                </Card>
                 <Card className="bg-zinc-900 border-white/10 rounded-2xl p-8">
                    <h3 className="font-bold mb-4">Developer Information</h3>
                    <div className="space-y-3 text-sm">
                        <p className="flex items-center gap-3"><Globe className="h-4 w-4 text-zinc-400"/>{project.developer}</p>
                        {/* Placeholder details */}
                        <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-zinc-400"/>sales@developer.com</p>
                        <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-zinc-400"/>+971 4 123 4567</p>
                    </div>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
};

function InfoCard({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) {
    return (
        <div className="bg-zinc-900 border border-white/10 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-600/10 rounded-lg text-blue-500">
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-xs text-zinc-400 font-semibold">{label}</p>
                <p className="text-lg font-bold text-white">{value}</p>
            </div>
        </div>
    )
}

export default ProjectDetailPage;
