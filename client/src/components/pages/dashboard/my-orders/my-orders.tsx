"use client";

import * as React from "react";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "../../../shared/data-table";

import {
  useOrders,
} from "@/hooks/use-orders";

import type {
  Order,
  OrderStatus,
} from "@/types/order";

import {
  getOrderColumns,
} from "./order.column";

export default function MyOrders() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] =
    React.useState<"all" | OrderStatus>("all");

  const {
    data: response,
    isLoading,
    error,
  } = useOrders({
    limit: 100,
    status: selectedStatus === "all" ? undefined : selectedStatus,
    sortOrder: "desc",
  });

  const orders = React.useMemo<Order[]>(() => {
    if (!Array.isArray(response?.data)) {
      return [];
    }

    return response.data;
  }, [response?.data]);

  const filteredOrders = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return orders;
    }

    return orders.filter((order) => {
      const orderId = order.id.toLowerCase();

      return (
        orderId.includes(query) ||
        order.shippingAddress.toLowerCase().includes(query) ||
        order.phone.toLowerCase().includes(query)
      );
    });
  }, [orders, searchQuery]);

  const handleViewOrder = React.useCallback((order: Order) => {
    toast.info(`Order #${order.id.slice(0, 8)}`);
  }, []);

  const columns = React.useMemo(
    () =>
      getOrderColumns({
        onView: handleViewOrder,
      }),
    [handleViewOrder],
  );

  const statuses: Array<"all" | OrderStatus> = [
    "all",
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            My Orders
          </h2>

          <p className="text-xs text-muted-foreground">
            View and track all your medicine orders.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search order..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            className="rounded-xl pl-9"
          />
        </div>

        <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
          {statuses.map((status) => (
            <Button
              key={status}
              type="button"
              size="sm"
              variant={
                selectedStatus === status
                  ? "default"
                  : "outline"
              }
              onClick={() => setSelectedStatus(status)}
              className="whitespace-nowrap rounded-xl text-xs capitalize"
            >
              {status === "all" ? "All" : status}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-border/60 bg-card">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-border/60 bg-card">
          <p className="text-sm text-destructive">
            Failed to load orders. Please try again.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredOrders}
        />
      )}
    </div>
  );
}