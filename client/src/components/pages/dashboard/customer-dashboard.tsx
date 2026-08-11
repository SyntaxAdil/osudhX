// src/components/pages/dashboard/customer-dashboard.tsx
"use client";

import * as React from "react";
import { ShoppingCart, Clock, Wallet, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatsGrid } from "@/components/pages/dashboard/stats-grid";
import { RecentOrdersTable } from "@/components/pages/dashboard/recent-orders-table";
import {
  StatItem,
  OrderRow,
  MonthlyDataPoint,
  OrderStatusDataPoint,
} from "@/types/dashboard";
import { NoData } from "../../shared/no-data";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2, 45 93% 47%))",
  "hsl(var(--destructive))",
];

interface ApiOrderItem {
  id: string;
  shippingAddress: string;
  totalAmount: number;
  status: string;
  createdAt?: string;
  orderItems?: { length: number }[];
}

export function CustomerDashboard() {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [monthlySpending, setMonthlySpending] = React.useState<
    MonthlyDataPoint[]
  >([]);
  const [orderStatusData, setOrderStatusData] = React.useState<
    OrderStatusDataPoint[]
  >([]);
  const [customerStats, setCustomerStats] = React.useState<StatItem[]>([]);
  const [customerOrders, setCustomerOrders] = React.useState<OrderRow[]>([]);

  React.useEffect(() => {
    async function fetchCustomerDashboardData() {
      try {
        const token = localStorage.getItem("bearer_token") || "";
        const headers = { Authorization: `Bearer ${token}` };

        const ordersRes = await fetch(
          "http://localhost:5000/api/orders?page=1&limit=5",
          { headers },
        );
        const ordersJson = await ordersRes.json();

        if (ordersJson.success) {
          const fetchedOrders: ApiOrderItem[] = ordersJson.data;

          let totalSpentCalc = 0;
          let pendingCount = 0;
          let deliveredCount = 0;
          let cancelledCount = 0;

          const mappedOrders: OrderRow[] = fetchedOrders.map((ord) => {
            totalSpentCalc += ord.totalAmount;
            if (ord.status === "pending") pendingCount++;
            else if (ord.status === "delivered") deliveredCount++;
            else if (ord.status === "cancelled") cancelledCount++;

            return {
              id: ord.id,
              primaryIdentifier: ord.shippingAddress,
              secondaryDetail: `${ord.orderItems?.length || 0} items`,
              amount: ord.totalAmount,
              status: ord.status,
              date: new Date(ord.createdAt || Date.now()).toLocaleDateString(),
            };
          });

          setCustomerOrders(mappedOrders);

          setCustomerStats([
            {
              title: "Total Orders",
              value: ordersJson.meta?.total || fetchedOrders.length,
              icon: ShoppingCart,
              iconColor: "text-primary",
              iconBg: "bg-primary/10",
            },
            {
              title: "Pending Orders",
              value: pendingCount,
              icon: Clock,
              iconColor: "text-amber-500",
              iconBg: "bg-amber-500/10",
            },
            {
              title: "Total Spent",
              value: `৳ ${totalSpentCalc}`,
              icon: Wallet,
              iconColor: "text-emerald-500",
              iconBg: "bg-emerald-500/10",
            },
          ]);

          setOrderStatusData([
            { name: "Delivered", value: deliveredCount },
            { name: "Pending", value: pendingCount },
            { name: "Cancelled", value: cancelledCount },
          ]);
        }

        setMonthlySpending([]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCustomerDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasOrders = customerOrders.length > 0;
  const hasSpending = monthlySpending.length > 0;
  const hasStatus = orderStatusData.some((item) => item.value > 0);

  return (
    <div className="space-y-6">
      <StatsGrid stats={customerStats} columns={3} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
          <h4 className="text-base font-bold text-foreground mb-4">
            Monthly Spending
          </h4>
          {hasSpending ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlySpending}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="spent"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <NoData
              title="No Spending Data"
              message="No spending analytics available for the selected period."
            />
          )}
        </div>

        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
          <h4 className="text-base font-bold text-foreground mb-4">
            Order Status
          </h4>
          {hasStatus ? (
            <div className="h-[250px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
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
                    {orderStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
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
          orders={customerOrders}
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
