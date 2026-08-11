// src/app/dashboard/page.tsx
"use client";

import { useSession } from "@/lib/auth-client";
import { SellerDashboard } from "@/components/pages/dashboard/seller-dashboard";
import { CustomerDashboard } from "@/components/pages/dashboard/customer-dashboard";

interface CustomUser {
  role?: "seller" | "customer";
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const user = session?.user as unknown as CustomUser;
  const role = user?.role === "seller" ? "seller" : "customer";

  return role === "seller" ? <SellerDashboard /> : <CustomerDashboard />;
}