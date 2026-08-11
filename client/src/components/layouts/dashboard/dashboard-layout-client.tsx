// src/components/layouts/dashboard/dashboard-layout-client.tsx
"use client";

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import type { User } from "@/types/user";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
}

interface CustomUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: "seller" | "customer";
  createdAt?: Date | string;
  updatedAt?: Date | string;
  emailVerified?: boolean;
}

export function DashboardLayoutClient({
  children,
}: DashboardLayoutClientProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session || !session.user) {
    router.push("/login");
    return null;
  }

  const currentUser = session.user as unknown as CustomUser;
  const userRole = currentUser.role === "seller" ? "seller" : "customer";

  const user: User = {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    image: currentUser.image,
    createdAt: currentUser.createdAt
      ? new Date(currentUser.createdAt)
      : new Date(),
    updatedAt: currentUser.updatedAt
      ? new Date(currentUser.updatedAt)
      : new Date(),
    emailVerified: currentUser.emailVerified ?? false,
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <DashboardSidebar userRole={userRole} user={user} />
          <div className="flex flex-col flex-1 min-w-0">
            <DashboardHeader />
            <main className="flex-1 p-6 md:p-8 bg-muted/10">
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
