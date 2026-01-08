'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus, FileText, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/apiFetch';

interface KnowledgeUploaderProps {
  onUploadSuccess: (fileName: string) => void;
}

export function KnowledgeUploader({ onUploadSuccess }: KnowledgeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
        const acceptedFile = acceptedFiles[0];
        if (acceptedFile.type !== 'application/pdf') {
            setError('Invalid file type. Please upload a PDF file.');
            return;
        }
        setError(null);
        setFile(acceptedFile);
        handleUpload(acceptedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const handleUpload = async (fileToUpload: File) => {
    if (!fileToUpload) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      const res = await apiFetch('/api/agent/train', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        toast({
          title: "Training Complete",
          description: `${result.fileName} has been added to the knowledge base.`,
        });
        onUploadSuccess(result.fileName);
        setFile(null);
      } else {
        setError(result.error || 'An unknown error occurred.');
      }
    } catch (e: any) {
      setError("Couldn't connect right now. Please try again.");
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  if (uploading) {
    return (
        <div className="p-8 rounded-2xl border-2 border-dashed border-blue-500/50 bg-black/20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">ANALYZING DOCUMENT...</p>
        </div>
    );
  }

  return (
    <div {...getRootProps()} className={`p-8 rounded-2xl border-2 border-dashed border-white/10 bg-black/20 flex flex-col items-center justify-center gap-4 group hover:border-blue-500/50 transition-all cursor-pointer`}>
        <input {...getInputProps()} />
        <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
            <Plus className="h-6 w-6" />
        </div>
        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Add Project Brochure (PDF)</p>
        {error && (
            <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {error}
            </div>
        )}
    </div>
  );
}
