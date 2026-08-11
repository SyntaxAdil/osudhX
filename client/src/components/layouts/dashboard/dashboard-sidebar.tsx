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
  { title: "Products", href: "/dashboard/products", icon: Package },
  { title: "Inventory", href: "/dashboard/inventory", icon: Boxes },
  { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { title: "Profile", href: "/dashboard/profile", icon: Settings },
];

const customerNav = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Orders", href: "/dashboard/my-orders", icon: ShoppingCart },
  { title: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { title: "Profile", href: "/dashboard/profile", icon: Settings },
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
    defaultUser.name.split(" ").slice(0,2).map((c: string) => c[0]?.toUpperCase()).join("") || "U";

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logout successful");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border/55 px-3 py-4 overflow-hidden">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-sm">
            {userRole === "seller" ? (
              <Store className="h-5 w-5" />
            ) : (
              <UserCheck className="h-5 w-5" />
            )}
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden overflow-hidden min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <Logo />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground truncate uppercase tracking-wider mt-0.5">
              {userRole} Portal
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className=" py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-xs font-semibold tracking-wider text-muted-foreground/70 mb-2 px-2">
            MAIN MENU
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.title}
                    className={`rounded-xl px-3 py-2.5 transition-all font-medium w-full flex items-center gap-3 overflow-hidden group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 w-full outline-none overflow-hidden group-data-[collapsible=icon]:justify-center"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden text-sm truncate">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/55 p-3 space-y-2 overflow-hidden">
        {/* User Info Section */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-sidebar-accent/50 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2 overflow-hidden">
          <Avatar className="h-8 w-8 shrink-0 border border-border/60 shadow-sm">
            <AvatarImage
              src={defaultUser.image || ""}
              alt={defaultUser.name}
            />
            <AvatarFallback className="rounded-xl font-semibold text-[10px] bg-primary/10 text-primary">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden min-w-0">
            <span className="text-xs font-semibold text-sidebar-foreground truncate">
              {defaultUser.name}
            </span>
            <span className="text-[10px] text-muted-foreground truncate">
              {defaultUser.email}
            </span>
          </div>
        </div>

        {/* Sign Out Action Button */}
        <button
          onClick={handleSignOut}
          title="Sign Out"
          className="flex items-center gap-3 w-full p-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors font-medium text-sm group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 overflow-hidden"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden truncate">Sign Out</span>
        </button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}