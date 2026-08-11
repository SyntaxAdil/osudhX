// src/app/dashboard/layout.tsx
import { DashboardLayoutClient } from "@/components/layouts/dashboard/dashboard-layout-client";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}