'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, ArrowLeft, Check, X } from 'lucide-react';
import Link from 'next/link';

export default function ImportContactsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <Link href="/sender/new" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to SMS Marketing
        </Link>
        <h1 className="text-4xl font-bold tracking-tight text-white mt-4">Import Contacts</h1>
        <p className="text-zinc-500 text-lg font-light">Upload a CSV file with your contacts to get started.</p>
      </div>

      <Card className="bg-zinc-900/50 border-white/5 rounded-[2.5rem]">
        <CardHeader>
          <CardTitle className="text-xl">Upload CSV</CardTitle>
          <CardDescription>Select a CSV file to import your contacts. The file should contain 'name' and 'phone' columns.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-48 border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center space-y-3">
            <Upload className="h-8 w-8 text-zinc-600" />
            <p className="text-zinc-500">Drag & drop your CSV file here, or click to select a file.</p>
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-full">
                Select File
            </Button>
          </div>

          <h2 className="text-lg font-semibold text-white">Preview</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="p-4">Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-800">
                  <td className="p-4">John Doe</td>
                  <td className="p-4">+1 (555) 123-4567</td>
                  <td className="p-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4">Jane Smith</td>
                  <td className="p-4">+1 (555) 987-6543</td>
                  <td className="p-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 text-red-400">Invalid Entry</td>
                  <td className="p-4 text-red-400">not a phone number</td>
                  <td className="p-4 text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="ghost">Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700">Import Contacts</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
