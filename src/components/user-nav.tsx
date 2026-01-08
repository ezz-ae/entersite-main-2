'use client';

import { CreditCard, LogOut, PlusCircle, Settings, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { ClientOnly } from "@/components/client-only";
import { LoginDialog } from "./auth/login-dialog";

export function UserNav() {
  const [user] = useAuthState(auth);

  const handleLogout = () => {
    signOut(auth);
  };

  if (!user) {
    return (
        <ClientOnly>
            <LoginDialog />
        </ClientOnly>
    )
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || "User";
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <ClientOnly>
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-white/10 hover:border-white/20 transition-all">
            <Avatar className="h-full w-full">
                <AvatarFallback className="bg-blue-600 text-white font-bold">{initials}</AvatarFallback>
            </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-zinc-950 border-white/10 text-white rounded-2xl p-2 shadow-2xl" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-2">
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none">{displayName}</p>
                <p className="text-xs leading-none text-zinc-500 mt-1">
                {user?.email}
                </p>
            </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuGroup className="space-y-1">
            <Link href="/profile">
                <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-white/5">
                    <UserIcon className="mr-2 h-4 w-4 text-zinc-500" />
                    <span>Profile</span>
                </DropdownMenuItem>
            </Link>
            <Link href="/dashboard/billing">
                <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-white/5">
                    <CreditCard className="mr-2 h-4 w-4 text-zinc-500" />
                    <span>Billing</span>
                </DropdownMenuItem>
            </Link>
            <Link href="/dashboard/settings">
                <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-white/5">
                    <Settings className="mr-2 h-4 w-4 text-zinc-500" />
                    <span>Settings</span>
                </DropdownMenuItem>
            </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem 
                className="rounded-lg cursor-pointer text-red-500 hover:bg-red-500/10 focus:bg-red-500/10"
                onClick={handleLogout}
            >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    </ClientOnly>
  );
}
