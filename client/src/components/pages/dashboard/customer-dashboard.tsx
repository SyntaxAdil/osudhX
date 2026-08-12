"use client";

import * as React from "react";
import {
  ShoppingCart,
  Clock,
  Wallet,
  Loader2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { StatsGrid } from "@/components/pages/dashboard/stats-grid";
import { RecentOrdersTable } from "@/components/pages/dashboard/recent-orders-table";
import { NoData } from "../../shared/no-data";

import {
  StatItem,
  OrderStatusDataPoint,
} from "@/types/dashboard";
import { useDashboard } from "../../../hooks/use-dashboard-data";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2, 45 93% 47%))",
  "hsl(var(--destructive))",
];

export function CustomerDashboard() {
  const {
    totalOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    totalSpent,
    recentOrders,
    isLoading,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats: StatItem[] = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
    },
    {
      title: "Total Spent",
      value: `৳ ${totalSpent}`,
      icon: Wallet,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
    },
  ];

  const orderStatusData: OrderStatusDataPoint[] = [
    {
      name: "Delivered",
      value: deliveredOrders,
    },
    {
      name: "Pending",
      value: pendingOrders,
    },
    {
      name: "Cancelled",
      value: cancelledOrders,
    },
  ];

  const hasOrders = recentOrders.length > 0;

  const hasStatus = orderStatusData.some(
    (item) => item.value > 0,
  );

  return (
    <div className="space-y-6">
      <StatsGrid stats={stats} columns={3} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
          <h4 className="text-base font-bold text-foreground mb-4">
            Monthly Spending
          </h4>

          <NoData
            title="No Spending Data"
            message="No spending analytics available for the selected period."
          />
        </div>

        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
          <h4 className="text-base font-bold text-foreground mb-4">
            Order Status
          </h4>

          {hasStatus ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map(
                      (_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            COLORS[
                              index % COLORS.length
                            ]
                          }
                        />
                      ),
                    )}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        "hsl(var(--card))",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <NoData
              title="No Order Status Data"
              message="There are no orders to categorize by status yet."
            />
          )}
        </div>
      </div>

      {hasOrders ? (
        <RecentOrdersTable
          title="Recent Orders"
          description="Your most recent medicine purchases"
          primaryColumnHeader="Shipping Address"
          secondaryColumnHeader="Items"
          orders={recentOrders}
        />
      ) : (
        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
          <h4 className="text-base font-bold text-foreground mb-4">
            Recent Orders
          </h4>

          <NoData
            title="No Recent Orders"
            message="You haven't placed any orders yet."
          />
        </div>
      )}
    </div>
  );
}