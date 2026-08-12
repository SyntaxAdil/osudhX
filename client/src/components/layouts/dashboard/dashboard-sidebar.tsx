// src/components/layouts/dashboard/dashboard-sidebar.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Heart,
  Store,
  UserCheck,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import type { User } from "@/types/user";
import Logo from "../../ui/logo";

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: "seller" | "customer";
  user?: User;
}

const sellerNav = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Medicines", href: "/dashboard/medicines", icon: Package },
  { title: "Inventory", href: "/dashboard/inventory", icon: Boxes },
  { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  // { title: "Profile", href: "/dashboard/profile", icon: Settings },
];

const customerNav = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Orders", href: "/dashboard/my-orders", icon: ShoppingCart },
  { title: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  // { title: "Profile", href: "/dashboard/profile", icon: Settings },
];

export function DashboardSidebar({
  userRole,
  user,
  ...props
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const navigationItems = userRole === "seller" ? sellerNav : customerNav;

  const defaultUser: User = {
    id: user?.id || "",
    name: user?.name || "User",
    email: user?.email || "",
    image: user?.image || null,
    createdAt: user?.createdAt || new Date(),
    updatedAt: user?.updatedAt || new Date(),
    emailVerified: user?.emailVerified || false,
  };

  const userInitial =
    defaultUser.name
      .split(" ")
      .slice(0, 2)
      .map((c: string) => c[0]?.toUpperCase())
      .join("") || "U";

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logout successful");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="border-r border-sidebar-border/60"
    >
      <SidebarHeader className="border-b border-sidebar-border/50  py-4">
        <div className="flex items-center gap-3 rounded-2xl  py-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_4px_14px_-4px_hsl(var(--primary)/0.5)] transition-transform duration-200 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9">
            {userRole === "seller" ? (
              <Store className="h-[18px] w-[18px]" />
            ) : (
              <UserCheck className="h-[18px] w-[18px]" />
            )}
          </div>

          <div className="flex min-w-0 flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <Link href={"/"} className="flex items-center truncate">
              <Logo />
            </Link>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.7)]" />
              <span className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {userRole} portal
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className=" py-5">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/60 group-data-[collapsible=icon]:hidden">
            Main Menu
          </SidebarGroupLabel>

          <SidebarMenu className="gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(`${item.href}/`));

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.title}
                    className={`relative h-11 w-full rounded-xl px-3 transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-[0_6px_18px_-7px_hsl(var(--primary)/0.7)] hover:bg-primary hover:text-primary-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <Link
                      href={item.href}
                      className="flex w-full items-center gap-3 overflow-hidden outline-none group-data-[collapsible=icon]:justify-center"
                    >
                      <Icon
                        className={`h-[17px] w-[17px] shrink-0 transition-transform duration-200 ${isActive ? "scale-105" : ""}`}
                      />

                      <span className="min-w-0 flex-1 truncate text-sm font-medium group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>

                      {isActive && (
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-70 group-data-[collapsible=icon]:hidden" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-2.5">
        <div className="mb-2 flex items-center gap-3 rounded-2xl border border-sidebar-border/50 bg-sidebar-accent/40 p-2.5 transition-colors hover:bg-sidebar-accent/70 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-1.5">
          <Avatar className="h-9 w-9 shrink-0 rounded-xl border border-border/50 shadow-sm">
            <AvatarImage src={defaultUser.image || ""} alt={defaultUser.name} />
            <AvatarFallback className="rounded-xl bg-primary/10 text-xs font-bold text-primary">
              {userInitial}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
            <p className="truncate text-xs font-semibold text-sidebar-foreground">
              {defaultUser.name}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
              {defaultUser.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          title="Sign Out"
          className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
        >
          <LogOut className="h-[17px] w-[17px] shrink-0" />
          <span className="truncate group-data-[collapsible=icon]:hidden">
            Sign Out
          </span>
        </button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
