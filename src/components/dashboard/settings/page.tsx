'use client';

import React from 'react';
import Image from 'next/image';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function SettingsDashboardPage() {
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar-4');
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

        <Tabs defaultValue="general">
            <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your personal details and public profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="flex items-center gap-6">
                            <Avatar className="h-20 w-20">
                                {userAvatar && <AvatarImage src={userAvatar.imageUrl} />}
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <Button variant="outline">Change Avatar</Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input defaultValue="John" />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input defaultValue="Doe" />
                            </div>
                             <div className="space-y-2 md:col-span-2">
                                <Label>Email</Label>
                                <Input defaultValue="john@example.com" disabled />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button>Save Changes</Button>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Company Details</CardTitle>
                        <CardDescription>Used for invoices and legal footer.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input defaultValue="Acme Real Estate" />
                        </div>
                         <div className="space-y-2">
                            <Label>Address</Label>
                            <Input defaultValue="123 Business Bay, Dubai" />
                        </div>
                         <div className="flex justify-end">
                            <Button>Save Company Info</Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Email Notifications</CardTitle>
                        <CardDescription>Manage what emails you receive.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>New Lead Alerts</Label>
                                <p className="text-sm text-muted-foreground">Get notified immediately when a form is submitted.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Weekly Performance Report</Label>
                                <p className="text-sm text-muted-foreground">Summary of site traffic and ad performance.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                         <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Product Updates</Label>
                                <p className="text-sm text-muted-foreground">News about new features and templates.</p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Current Password</Label>
                            <Input type="password" />
                        </div>
                         <div className="space-y-2">
                            <Label>New Password</Label>
                            <Input type="password" />
                        </div>
                        <div className="flex justify-end">
                            <Button>Update Password</Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

      </div>
    </DashboardLayout>
  );
}
