'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authorizedFetch } from '@/lib/auth-fetch';

interface ImportContactsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: (count: number) => void;
}

export function ImportContactsDialog({ open, onOpenChange, onImportComplete }: ImportContactsDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
        const acceptedFile = acceptedFiles[0];
        if (acceptedFile.type !== 'text/csv') {
            setError('Invalid file type. Please upload a CSV file.');
            return;
        }
        setError(null);
        setFile(acceptedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false
  });

  const handleImport = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await authorizedFetch('/api/contacts/import', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        toast({
          title: "Import Successful",
          description: `${result.count} contacts were imported.`,
        });
        onImportComplete(result.count);
        setFile(null);
        onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
          <DialogDescription>Upload a CSV file with 'name' and 'email' columns.</DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
            <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700 hover:border-zinc-500'}`}>
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2 text-zinc-500">
                    <UploadCloud className="h-8 w-8" />
                    {isDragActive ? (
                        <p>Drop the file here ...</p>
                    ) : (
                        <p>Drag & drop a CSV file here, or click to select</p>
                    )}
                </div>
            </div>

            {file && (
                <div className="mt-4 p-3 bg-zinc-800 rounded-md flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-zinc-400" />
                        <span className="text-sm text-zinc-300">{file.name}</span>
                    </div>
                    <button onClick={() => setFile(null)} className="text-zinc-500 hover:text-white text-xs font-bold">REMOVE</button>
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-900/50 border border-red-500/30 rounded-md flex items-center gap-2 text-sm text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    <span>{error}</span>
                </div>
            )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>Cancel</Button>
          <Button onClick={handleImport} disabled={!file || uploading}>
            {uploading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing...</>
            ) : (
                'Import Contacts'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
