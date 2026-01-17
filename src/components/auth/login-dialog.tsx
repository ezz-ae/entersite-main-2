'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export function LoginDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
  const pathname = usePathname();
  const loginHref = pathname ? `/login?returnTo=${encodeURIComponent(pathname)}` : '/login';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login required</DialogTitle>
          <DialogDescription>Continue with phone verification to keep your progress.</DialogDescription>
        </DialogHeader>
        <Button asChild className="w-full">
          <Link href={loginHref}>Continue to login</Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
