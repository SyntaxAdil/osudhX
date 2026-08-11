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

import type { User } from "@/types/user";
import AvatarDropdown from "../../ui/avatar-dropdown";

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: "seller" | "customer";
  user?: User;
}

const sellerNav = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Products", href: "/dashboard/products", icon: Package },
  { title: "Inventory", href: "/dashboard/inventory", icon: Boxes },
  { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
];

const customerNav = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Orders", href: "/dashboard/my-orders", icon: ShoppingCart },
  { title: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
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

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border/55 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-sm">
            {userRole === "seller" ? (
              <Store className="h-5 w-5" />
            ) : (
              <UserCheck className="h-5 w-5" />
            )}
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight text-sidebar-foreground capitalize">
              {userRole} Portal
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[140px]">
              OSUDHX Pharmacy
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-xs font-medium text-muted-foreground mb-2">
            Main Menu
          </SidebarGroupLabel>
          <SidebarMenu>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.title}
                    className="rounded-xl px-3 py-2 transition-all font-medium w-full"
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 w-full"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden">
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

      <SidebarFooter className="border-t border-sidebar-border/55 p-3">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <AvatarDropdown user={defaultUser} />
          <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-semibold text-sidebar-foreground truncate">
              {defaultUser.name}
            </span>
            <span className="text-[10px] text-muted-foreground truncate">
              {defaultUser.email}
            </span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
