// src/components/layouts/dashboard/dashboard-header.tsx
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function DashboardHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/60 bg-card px-4 md:px-6 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 h-9 w-9 rounded-xl border border-border/60 hover:bg-muted" />
        <Separator orientation="vertical" className="h-4 mr-2" />
        <h1 className="text-base font-semibold text-foreground tracking-tight">
          Dashboard Overview
        </h1>
      </div>
    </header>
  );
}