"use client";

import { useQuery } from "@tanstack/react-query";

import { orderService } from "@/services/order.service";
import { productService } from "@/services/product.service";

interface ApiProduct {
  id: string;
  name: string;
  stock: number;
}

interface ApiOrder {
  id: string;
  shippingAddress: string;
  totalAmount: number;
  status: string;
  createdAt?: string;
  orderItems?: unknown[];
}

export function useDashboard() {
  const productsQuery = useQuery({
    queryKey: ["dashboard", "products"],
    queryFn: async () => {
      const result = await productService.getProducts({
        limit: 100,
      });

      return result;
    },
  });

  const ordersQuery = useQuery({
    queryKey: ["dashboard", "orders"],
    queryFn: async () => {
      const result = await orderService.getOrders({
        page: 1,
        limit: 5,
      });

      return result;
    },
  });

  const products: ApiProduct[] =
    (productsQuery.data?.data as ApiProduct[]) || [];

  const orders: ApiOrder[] =
    (ordersQuery.data?.data as ApiOrder[]) || [];

  const totalProducts =
    productsQuery.data?.meta?.total || products.length;

  const totalOrders =
    ordersQuery.data?.meta?.total || orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  const confirmedOrders = orders.filter(
    (order) => order.status === "confirmed",
  ).length;

  const completedOrders =
    deliveredOrders + confirmedOrders;

  const totalSpent = orders.reduce(
    (total, order) => total + order.totalAmount,
    0,
  );

  const totalRevenue = orders
    .filter(
      (order) =>
        order.status === "delivered" ||
        order.status === "confirmed",
    )
    .reduce(
      (total, order) => total + order.totalAmount,
      0,
    );

  const recentOrders = orders.map((order) => ({
    id: order.id,
    primaryIdentifier: order.shippingAddress,
    secondaryDetail: `${order.orderItems?.length || 0} items`,
    amount: order.totalAmount,
    status: order.status,
    date: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString()
      : "",
  }));

  const lowStockProducts = products
    .filter((product) => product.stock <= 10)
    .map((product) => ({
      id: product.id,
      name: product.name,
      stock: product.stock,
      status: product.stock === 0 ? "Critical" : "Low",
    }));

  return {
    totalProducts,
    totalOrders,
    pendingOrders,
    cancelledOrders,
    deliveredOrders,
    confirmedOrders,
    completedOrders,
    totalSpent,
    totalRevenue,
    recentOrders,
    lowStockProducts,

    isLoading:
      productsQuery.isLoading || ordersQuery.isLoading,

    isError:
      productsQuery.isError || ordersQuery.isError,

    error:
      productsQuery.error || ordersQuery.error,

    refetch: async () => {
      await Promise.all([
        productsQuery.refetch(),
        ordersQuery.refetch(),
      ]);
    },
  };
}