"use client";

import * as React from "react";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
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

export function SellerDashboard() {
  const {
    totalProducts,
    totalOrders,
    totalRevenue,
    completedOrders,
    pendingOrders,
    cancelledOrders,
    recentOrders,
    lowStockProducts,
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
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
    },
    {
      title: "Total Revenue",
      value: `৳ ${totalRevenue}`,
      icon: TrendingUp,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
    },
  ];

  const orderStatusData: OrderStatusDataPoint[] = [
    {
      name: "Completed",
      value: completedOrders,
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

  const hasLowStock = lowStockProducts.length > 0;

  return (
    <div className="space-y-6">
      <StatsGrid stats={stats} columns={3} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
          <h4 className="text-base font-bold text-foreground mb-4">
            Monthly Revenue
          </h4>

          <NoData
            title="No Revenue Data"
            message="No monthly revenue metrics recorded yet."
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
              message="There are no active orders to display."
            />
          )}
        </div>
      </div>

      {hasOrders ? (
        <RecentOrdersTable
          title="Recent Orders"
          description="Latest transactions placed in your pharmacy"
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
            message="No customer orders received yet."
          />
        </div>
      )}

      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/60">
          <h4 className="text-base font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Low Stock Products
          </h4>

          <p className="text-xs text-muted-foreground">
            Products that need immediate restocking
          </p>
        </div>

        {hasLowStock ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-6">
                    Product ID
                  </th>
                  <th className="py-3 px-6">
                    Product Name
                  </th>
                  <th className="py-3 px-6">
                    Current Stock
                  </th>
                  <th className="py-3 px-6">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/40 text-sm">
                {lowStockProducts.map(
                  (product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-6 font-semibold text-foreground">
                        {product.id}
                      </td>

                      <td className="py-4 px-6 text-muted-foreground">
                        {product.name}
                      </td>

                      <td className="py-4 px-6 font-bold text-foreground">
                        {product.stock} units
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            product.status ===
                            "Critical"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <NoData
              title="All Stock Levels Healthy"
              message="There are no products running low on stock."
            />
          </div>
        )}
      </div>
    </div>
  );
}