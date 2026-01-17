'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { captureLead } from '@/lib/leads';
import { useCampaignAttribution } from '@/hooks/useCampaignAttribution';

export function BookingViewingBlock({
  headline = "Schedule a Viewing",
  subtext = "Select a date and time to visit the property with one of this area specialists.",
  tenantId = "public",
  projectName = "Viewing Request",
  siteId,
}: { headline?: string, subtext?: string, tenantId?: string, projectName?: string, siteId?: string }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const attribution = useCampaignAttribution();

  const timeSlots = ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM", "05:00 PM"];

  const handleConfirm = async () => {
    if (!date || !selectedSlot) return;
    setSubmitting(true);
    try {
      await captureLead({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        project: projectName,
        source: 'booking-viewing',
        context: { page: 'booking-viewing', buttonId: 'booking-confirm', service: 'viewing' },
        metadata: {
          date: date.toISOString(),
          slot: selectedSlot,
          siteId,
        },
        attribution: attribution ?? undefined,
        tenantId,
        siteId,
      });
      setStep(3);
    } catch (error) {
      console.error('Failed to confirm viewing', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-muted/10">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{headline}</h2>
            <p className="text-muted-foreground">{subtext}</p>
        </div>

        <Card className="border-0 shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-12 min-h-[500px]">
                {/* Sidebar Info */}
                <div className="md:col-span-4 bg-zinc-900 text-white p-8 flex flex-col justify-between">
                    <div>
                        <div className="mb-8">
                            <Badge variant="outline" className="text-white border-white/20 mb-2">In-Person Tour</Badge>
                            <h3 className="text-2xl font-bold">Elysian Residence</h3>
                            <div className="flex items-center gap-2 text-zinc-400 mt-2 text-sm">
                                <MapPin className="h-4 w-4" /> Jumeirah Garden City
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Duration</p>
                                    <p className="text-xs text-zinc-400">45 Minutes</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <CalendarDays className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Availability</p>
                                    <p className="text-xs text-zinc-400">Mon - Sun</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/10">
                        <p className="text-xs text-zinc-500">
                            Can't make it? <a href="#" className="underline text-white">Request a video tour</a>.
                        </p>
                    </div>
                </div>

                {/* Calendar & Form */}
                <div className="md:col-span-8 p-8 bg-background">
                    {step === 1 ? (
                        <div className="space-y-6">
                            <h4 className="font-semibold text-lg">Select Date & Time</h4>
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="border rounded-xl p-4">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        className="rounded-md"
                                    />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <Label>Available Slots</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {timeSlots.map((time) => (
                                            <Button
                                              key={time}
                                              variant={selectedSlot === time ? 'default' : 'outline'}
                                              className="justify-center hover:border-primary hover:text-primary transition-colors"
                                              onClick={() => setSelectedSlot(time)}
                                            >
                                                {time}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={() => setStep(2)} disabled={!date || !selectedSlot}>
                                  Next Step
                                </Button>
                            </div>
                        </div>
                    ) : step === 2 ? (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                             <h4 className="font-semibold text-lg">Your Details</h4>
                             <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                     <Label>First Name</Label>
                                     <Input
                                       placeholder="John"
                                       value={formData.firstName}
                                       onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                                     />
                                 </div>
                                 <div className="space-y-2">
                                     <Label>Last Name</Label>
                                     <Input
                                       placeholder="Doe"
                                       value={formData.lastName}
                                       onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                                     />
                                 </div>
                                 <div className="space-y-2 col-span-2">
                                     <Label>Email</Label>
                                     <Input
                                       type="email"
                                       placeholder="john@example.com"
                                       value={formData.email}
                                       onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                     />
                                 </div>
                                  <div className="space-y-2 col-span-2">
                                     <Label>Phone</Label>
                                     <Input
                                       type="tel"
                                       placeholder="+971..."
                                       value={formData.phone}
                                       onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                                     />
                                 </div>
                             </div>
                             <div className="flex justify-between pt-4">
                                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                                <Button
                                  className="bg-green-600 hover:bg-green-700"
                                  disabled={submitting || !formData.email || !formData.phone}
                                  onClick={handleConfirm}
                                >
                                  {submitting ? 'Confirming…' : 'Confirm Booking'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-2xl font-semibold">Viewing Scheduled</h4>
                            <p className="text-muted-foreground">
                              Our concierge will confirm your visit for {selectedSlot} on {date?.toLocaleDateString()} within the next hour.
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setStep(1);
                              setSelectedSlot(null);
                            }}
                          >
                            Schedule another tour
                          </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>

      </div>
    </section>
  );
}
