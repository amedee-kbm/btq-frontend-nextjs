"use client";

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

import { useAuth } from "@/components/auth-provider";

import { UserCircleIcon } from "@phosphor-icons/react";

export default function AccountDropdown() {
  const auth = useAuth();
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    auth.logout();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="flex justify-center items-center gap-1">
            <UserCircleIcon size={22} weight="fill" />
            <span className="text-xs">
              {auth.user?.username ?? auth.user?.email ?? "Account"}
            </span>
          </button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
