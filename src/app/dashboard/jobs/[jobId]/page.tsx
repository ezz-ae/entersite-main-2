'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;

    const jobRef = doc(db, 'jobs', jobId as string);
    const unsubscribe = onSnapshot(jobRef, (doc) => {
      if (doc.exists()) {
        setJob({ id: doc.id, ...doc.data() });
      } else {
        setJob(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!job) {
    return <p>Job not found.</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Job Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>Job Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {JSON.stringify(job, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
