'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
    MessageCircle, Users, Zap, Bot, Send, BarChart3, 
    Settings, Play, Pause, Calendar, Heart, MessageSquare 
} from "lucide-react";
import { cn } from "@/lib/utils";

export function InstagramBotDashboard() {
    const [isActive, setIsActive] = useState(false);
    const [logs, setLogs] = useState([
        { time: "10:42 AM", action: "Replied to DM", user: "@sarah_dxb", detail: "Sent brochure link" },
        { time: "10:38 AM", action: "Commented", user: "@realestate_investor", detail: "Great insights! 🚀" },
        { time: "10:15 AM", action: "Followed", user: "@dubai_luxury_homes", detail: "Target: Competitor Followers" },
        { time: "09:55 AM", action: "Story Reply", user: "@invest_smart", detail: "🔥" },
    ]);

    return (
        <Card className="w-full h-full bg-background border-0 shadow-none">
            <CardHeader className="px-0 pt-0">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl">Instagram Growth Agent</CardTitle>
                        <CardDescription>Automate engagement, DM responses, and lead qualification.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={cn("text-sm font-medium", isActive ? "text-green-500" : "text-zinc-500")}>
                            {isActive ? "Active" : "Paused"}
                        </span>
                        <Switch checked={isActive} onCheckedChange={setIsActive} />
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="px-0">
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <MetricCard label="New Followers" value="+1,240" sub="+12% vs last week" icon={Users} />
                    <MetricCard label="DMs Handled" value="843" sub="98% Auto-reply rate" icon={MessageCircle} />
                    <MetricCard label="Leads Captured" value="156" sub="From comments & DMs" icon={Zap} highlight />
                </div>

                <Tabs defaultValue="activity" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 p-1">
                        <TabsTrigger value="activity">Live Activity</TabsTrigger>
                        <TabsTrigger value="automation">Automation Rules</TabsTrigger>
                        <TabsTrigger value="targeting">Targeting</TabsTrigger>
                    </TabsList>

                    <TabsContent value="activity" className="space-y-4">
                        <div className="bg-card border rounded-xl overflow-hidden">
                            <div className="p-4 bg-muted/30 border-b flex justify-between items-center">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <Bot className="h-4 w-4 text-purple-500" /> Agent Logs
                                </h4>
                                <Badge variant="outline" className="text-xs font-mono">Live</Badge>
                            </div>
                            <div className="divide-y">
                                {logs.map((log, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between text-sm hover:bg-muted/20 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className="text-zinc-500 font-mono text-xs">{log.time}</span>
                                            <Badge variant="secondary" className="text-[10px] font-normal">{log.action}</Badge>
                                            <span className="font-medium text-blue-600 dark:text-blue-400">{log.user}</span>
                                        </div>
                                        <span className="text-zinc-500 text-xs truncate max-w-[150px]">{log.detail}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="automation" className="space-y-6">
                        <div className="space-y-4">
                             <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                                 <div className="space-y-1">
                                     <h4 className="font-medium flex items-center gap-2">
                                         <MessageSquare className="h-4 w-4 text-blue-500" />
                                         Auto-DM on "Price" Comment
                                     </h4>
                                     <p className="text-xs text-zinc-500">Send pricing details when user comments 'price' or 'cost'.</p>
                                 </div>
                                 <Switch defaultChecked />
                             </div>
                             
                             <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                                 <div className="space-y-1">
                                     <h4 className="font-medium flex items-center gap-2">
                                         <Users className="h-4 w-4 text-green-500" />
                                         Welcome New Followers
                                     </h4>
                                     <p className="text-xs text-zinc-500">Send a warm welcome message to new followers.</p>
                                 </div>
                                 <Switch />
                             </div>

                             <div className="p-4 border rounded-xl bg-card space-y-3">
                                 <Label>Open Smart Response Prompt</Label>
                                 <Textarea 
                                    placeholder="You are a helpful real estate assistant. If someone asks about availability, ask for their preferred budget..." 
                                    className="min-h-[100px] text-sm"
                                 />
                                 <Button size="sm" variant="secondary" className="w-full">Save Prompt</Button>
                             </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="targeting" className="space-y-6">
                         <div className="p-4 border rounded-xl bg-card space-y-4">
                             <div className="space-y-2">
                                 <Label>Target Competitor Accounts</Label>
                                 <Input placeholder="@emaardubai, @damacofficial..." />
                                 <p className="text-xs text-zinc-500">The bot will engage with followers of these accounts.</p>
                             </div>
                             
                             <div className="space-y-2">
                                 <Label>Target Hashtags</Label>
                                 <Input placeholder="#dubairealestate, #luxuryhomes..." />
                             </div>

                             <div className="pt-2">
                                 <Button className="w-full">Update Targeting</Button>
                             </div>
                         </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

function MetricCard({ label, value, sub, icon: Icon, highlight }: any) {
    return (
        <div className={cn("p-4 rounded-xl border flex flex-col justify-between", highlight ? "bg-primary/5 border-primary/20" : "bg-card")}>
            <div className="flex justify-between items-start mb-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
                <Icon className={cn("h-4 w-4", highlight ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{sub}</p>
            </div>
        </div>
    )
}
