'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { apiFetch } from '@/lib/apiFetch';
import { useToast } from '@/hooks/use-toast';

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadAdded: () => void;
}

export function AddLeadDialog({ open, onOpenChange, onLeadAdded }: AddLeadDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await apiFetch('/api/leads/create', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, message }),
      });

      if (response.ok) {
        toast({ title: "Lead Added", description: "The new lead has been added to your list." });
        onLeadAdded();
        onOpenChange(false);
      } else {
        throw new Error('Failed to add lead');
      }
    } catch (error) {
      console.error('Failed to add lead', error);
      toast({ title: "Error", description: "Failed to add lead. Please try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Lead</DialogTitle>
          <DialogDescription>
            Manually enter the details of a new lead below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Lead'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
