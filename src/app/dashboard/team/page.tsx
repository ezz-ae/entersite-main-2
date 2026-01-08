'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TeamDashboardPage() {
  return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
                <p className="text-muted-foreground">Invite colleagues and manage access permissions.</p>
            </div>
            <Button className="gap-2">
                <Plus className="h-4 w-4" /> Invite Member
            </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Active Members</CardTitle>
                <CardDescription>Manage who has access to your workspace.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {[
                        { name: "John Doe", email: "john@example.com", role: "Owner", status: "Active" },
                        { name: "Sarah Smith", email: "sarah@example.com", role: "Editor", status: "Active" },
                        { name: "Mike Jones", email: "mike@example.com", role: "Viewer", status: "Pending" },
                    ].map((member, i) => (
                        <div key={i} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${member.email}`} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-sm text-muted-foreground">{member.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className="min-w-[80px] justify-center">{member.role}</Badge>
                                <Badge variant={member.status === 'Active' ? 'secondary' : 'outline'} className={member.status === 'Pending' ? 'text-yellow-600 border-yellow-200 bg-yellow-50' : ''}>
                                    {member.status}
                                </Badge>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Edit Role</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">
                                            <Trash2 className="h-4 w-4 mr-2" /> Remove
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="flex gap-2">
                     <Input placeholder="Enter email address" className="max-w-sm" />
                     <Button variant="secondary">Send Invite</Button>
                 </div>
            </CardContent>
        </Card>

      </div>
  );
}
