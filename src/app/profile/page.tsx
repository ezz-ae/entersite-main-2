'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { authorizedFetch } from '@/lib/auth-fetch';

type ProfileRecord = {
  firstName?: string | null;
  lastName?: string | null;
  companyName?: string | null;
  officeAddress?: string | null;
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'You';
  const initials = useMemo(() => {
    const parts = displayName.split(' ').filter(Boolean);
    const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
    return letters || displayName.slice(0, 2).toUpperCase();
  }, [displayName]);

  useEffect(() => {
    if (!user) {
      setProfileLoading(false);
      return;
    }

    const displayParts = (user.displayName || '').split(' ').filter(Boolean);
    const fallbackFirst = displayParts[0] || '';
    const fallbackLast = displayParts.slice(1).join(' ');
    setFirstName(fallbackFirst);
    setLastName(fallbackLast);

    const loadProfile = async () => {
      try {
        const res = await authorizedFetch('/api/profile', { cache: 'no-store' });
        if (!res.ok) {
          setProfileLoading(false);
          return;
        }
        const data = await res.json();
        const profile: ProfileRecord = data.profile || {};
        setFirstName(profile.firstName || fallbackFirst);
        setLastName(profile.lastName || fallbackLast);
        setCompanyName(profile.companyName || '');
        setOfficeAddress(profile.officeAddress || '');
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      toast({ title: 'Sign in to save', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        firstName: firstName.trim() || null,
        lastName: lastName.trim() || null,
        companyName: companyName.trim() || null,
        officeAddress: officeAddress.trim() || null,
      };
      const res = await authorizedFetch('/api/profile', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Save failed');
      }

      const nextDisplayName = [payload.firstName, payload.lastName].filter(Boolean).join(' ');
      if (nextDisplayName && nextDisplayName !== user.displayName) {
        await updateProfile(user, { displayName: nextDisplayName });
      }
      toast({ title: 'Profile saved' });
    } catch (error: any) {
      toast({
        title: 'Could not save',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-6 max-w-3xl space-y-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            {user.photoURL ? <AvatarImage src={user.photoURL} /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-zinc-500">{user.email}</p>
          </div>
        </div>

        <Card className="bg-zinc-950 border-white/5 rounded-3xl">
          <CardHeader>
            <CardTitle>Your Details</CardTitle>
            <CardDescription>Update your name and company details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {profileLoading ? (
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading profile...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">First name</label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-11 bg-black/40 border-white/10 text-white"
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Last name</label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-11 bg-black/40 border-white/10 text-white"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Company name</label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="h-11 bg-black/40 border-white/10 text-white"
                    placeholder="Company name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Office address</label>
                  <Input
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                    className="h-11 bg-black/40 border-white/10 text-white"
                    placeholder="Office address"
                  />
                </div>

                <div className="flex justify-end">
                  <Button className="gap-2" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
