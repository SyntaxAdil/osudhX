"use client";

import { LayoutDashboard, LogOutIcon, UserCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "../../types/user";

export default function AvatarDropdown({ user }: { user: User }) {
  const { name: userName, email: userEmail, image: userImage } = user;
  const userInitial =
    userName.split(" ").map((c: string) => c[0].toUpperCase()) || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer">
        <Avatar className="size-10 border border-border/40 shadow-inner">
          <AvatarImage
            src={
              userImage ||
              "https://img.magnific.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_test_b&w=740&q=80"
            }
            alt={userName}
          />
          <AvatarFallback className="font-semibold text-sm bg-primary/10 text-primary">
            {userInitial}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 p-2 shadow-xl border-border/50 rounded-xl"
      >
        <div className="flex items-center gap-3 px-3 py-3 mb-1 bg-accent/40 rounded-lg">
          <Avatar className="size-10 border border-border/50">
            <AvatarImage
              src={
                userImage ||
                "https://img.magnific.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_test_b&w=740&q=80"
              }
              alt={userName}
            />
            <AvatarFallback className="font-semibold text-sm bg-primary/10 text-primary">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-foreground truncate">
              {userName}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {userEmail}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator className="my-1 bg-border/40" />

        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem className="cursor-pointer rounded-md py-2.5 px-3 font-medium text-muted-foreground hover:text-foreground transition-colors">
            <LayoutDashboard className="size-4 mr-2.5 text-muted-foreground" />
            <span>Dashboard Cockpit</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer rounded-md py-2.5 px-3 font-medium text-muted-foreground hover:text-foreground transition-colors">
            <UserCircle className="size-4 mr-2.5 text-muted-foreground" />
            <span>Profile & Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 bg-border/40" />

        <DropdownMenuItem className="cursor-pointer rounded-md py-2.5 px-3 font-medium text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors">
          <LogOutIcon className="size-4 mr-2.5" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
