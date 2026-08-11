// src/components/pages/dashboard/seller-dashboard.tsx
"use client";

import * as React from "react";
import { Package, ShoppingCart, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { StatsGrid } from "@/components/pages/dashboard/stats-grid";
import { RecentOrdersTable } from "@/components/pages/dashboard/recent-orders-table";

import { StatItem, OrderRow, LowStockProduct, MonthlyDataPoint, OrderStatusDataPoint } from "@/types/dashboard";
import { NoData } from "../../shared/no-data";

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2, 45 93% 47%))", "hsl(var(--destructive))"];

interface ApiProductItem {
  id: string;
  name: string;
  stock: number;
}

interface ApiOrderItem {
  id: string;
  shippingAddress: string;
  totalAmount: number;
  status: string;
  createdAt?: string;
  orderItems?: { length: number }[];
}

export function SellerDashboard() {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [monthlyRevenue, setMonthlyRevenue] = React.useState<MonthlyDataPoint[]>([]);
  const [orderStatusData, setOrderStatusData] = React.useState<OrderStatusDataPoint[]>([]);
  const [sellerStats, setSellerStats] = React.useState<StatItem[]>([]);
  const [sellerOrders, setSellerOrders] = React.useState<OrderRow[]>([]);
  const [lowStockProducts, setLowStockProducts] = React.useState<LowStockProduct[]>([]);

  React.useEffect(() => {
    async function fetchSellerDashboardData() {
      try {
        const token = localStorage.getItem("bearer_token") || "";
        const headers = { Authorization: `Bearer ${token}` };

        const productsRes = await fetch("http://localhost:5000/api/products?limit=100", { headers });
        const productsJson = await productsRes.json();

        let totalProductsCount = 0;
        const lowStockArr: LowStockProduct[] = [];

        if (productsJson.success) {
          const allProds: ApiProductItem[] = productsJson.data;
          totalProductsCount = allProds.length;
          allProds.forEach((prod) => {
            if (prod.stock <= 10) {
              lowStockArr.push({
                id: prod.id,
                name: prod.name,
                stock: prod.stock,
                status: prod.stock === 0 ? "Critical" : "Low",
              });
            }
          });
        }
        setLowStockProducts(lowStockArr);

        const ordersRes = await fetch("http://localhost:5000/api/orders?page=1&limit=5", { headers });
        const ordersJson = await ordersRes.json();

        let totalOrdersCount = 0;
        let totalRevenueCalc = 0;
        let completedCount = 0;
        let pendingCount = 0;
        let cancelledCount = 0;
        const mappedOrders: OrderRow[] = [];

        if (ordersJson.success) {
          const fetchedOrders: ApiOrderItem[] = ordersJson.data;
          totalOrdersCount = ordersJson.meta?.total || fetchedOrders.length;

          fetchedOrders.forEach((ord) => {
            if (ord.status === "delivered" || ord.status === "confirmed") {
              totalRevenueCalc += ord.totalAmount;
            }
            if (ord.status === "pending") pendingCount++;
            else if (ord.status === "delivered" || ord.status === "confirmed") completedCount++;
            else if (ord.status === "cancelled") cancelledCount++;

            mappedOrders.push({
              id: ord.id,
              primaryIdentifier: ord.shippingAddress,
              secondaryDetail: `${ord.orderItems?.length || 0} items`,
              amount: ord.totalAmount,
              status: ord.status,
              date: new Date(ord.createdAt || Date.now()).toLocaleDateString(),
            });
          });
        }

        setSellerOrders(mappedOrders);

        setSellerStats([
          {
            title: "Total Products",
            value: totalProductsCount,
            icon: Package,
            iconColor: "text-blue-500",
            iconBg: "bg-blue-500/10",
          },
          {
            title: "Total Orders",
            value: totalOrdersCount,
            icon: ShoppingCart,
            iconColor: "text-amber-500",
            iconBg: "bg-amber-500/10",
          },
          {
            title: "Total Revenue",
            value: `৳ ${totalRevenueCalc}`,
            icon: TrendingUp,
            iconColor: "text-emerald-500",
            iconBg: "bg-emerald-500/10",
          },
        ]);

        setOrderStatusData([
          { name: "Completed", value: completedCount },
          { name: "Pending", value: pendingCount },
          { name: "Cancelled", value: cancelledCount },
        ]);

        setMonthlyRevenue([]);

      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSellerDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasOrders = sellerOrders.length > 0;
  const hasRevenue = monthlyRevenue.length > 0;
  const hasStatus = orderStatusData.some((item) => item.value > 0);
  const hasLowStock = lowStockProducts.length > 0;

  return (
    <div className="space-y-6">
      <StatsGrid stats={sellerStats} columns={3} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
          <h4 className="text-base font-bold text-foreground mb-4">Monthly Revenue</h4>
          {hasRevenue ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "0.5rem", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--emerald-500, #10b981))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <NoData title="No Revenue Data" message="No monthly revenue metrics recorded yet." />
          )}
        </div>

        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
          <h4 className="text-base font-bold text-foreground mb-4">Order Status</h4>
          {hasStatus ? (
            <div className="h-[250px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "0.5rem", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <NoData title="No Order Status Data" message="There are no active orders to display." />
          )}
        </div>
      </div>

      {hasOrders ? (
        <RecentOrdersTable
          title="Recent Orders"
          description="Latest transactions placed in your pharmacy"
          primaryColumnHeader="Shipping Address"
          secondaryColumnHeader="Items"
          orders={sellerOrders}
        />
      ) : (
        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm">
          <h4 className="text-base font-bold text-foreground mb-4">Recent Orders</h4>
          <NoData title="No Recent Orders" message="No customer orders received yet." />
        </div>
      )}

      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/60 flex justify-between items-center">
          <div>
            <h4 className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Low Stock Products
            </h4>
            <p className="text-xs text-muted-foreground">Products that need immediate restocking</p>
          </div>
        </div>
        {hasLowStock ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-6">Product ID</th>
                  <th className="py-3 px-6">Product Name</th>
                  <th className="py-3 px-6">Current Stock</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm">
                {lowStockProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6 font-semibold text-foreground">{product.id}</td>
                    <td className="py-4 px-6 text-muted-foreground">{product.name}</td>
                    <td className="py-4 px-6 font-bold text-foreground">{product.stock} units</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${product.status === 'Critical' ? 'bg-destructive/10 text-destructive' : 'bg-amber-500/10 text-amber-500'}`}>
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <NoData title="All Stock Levels Healthy" message="There are no products running low on stock." />
          </div>
        )}
      </div>
    </div>
  );
}