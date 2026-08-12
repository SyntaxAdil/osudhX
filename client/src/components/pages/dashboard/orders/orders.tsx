"use client";

import * as React from "react";
import { Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import { useOrders } from "@/hooks/use-orders";

import type { Order, OrderQueryParams } from "@/types/order";

import { getOrderColumns } from "./order.column";
import { OrderDetailModal } from "./order-detail-modal";
import { DataTable } from "../../../shared/data-table";

const statusFilters: {
  label: string;
  value: OrderQueryParams["status"];
}[] = [
  {
    label: "All",
    value: undefined,
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Confirmed",
    value: "confirmed",
  },
  {
    label: "Shipped",
    value: "shipped",
  },
  {
    label: "Delivered",
    value: "delivered",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];

export default function Orders() {
  const [params, setParams] = React.useState<OrderQueryParams>({
    page: 1,
    limit: 10,
    sortOrder: "desc",
  });

  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const {
    data: response,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useOrders(params);

  const orders = Array.isArray(response?.data) ? response.data : [];

  const handleViewOrder = React.useCallback((order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = React.useCallback(() => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  }, []);

  const handleRefresh = async () => {
    try {
      await refetch();

      toast.success("Orders refreshed successfully");
    } catch {
      toast.error("Failed to refresh orders");
    }
  };

  const handleStatusFilter = (status: OrderQueryParams["status"]) => {
    setParams((previous) => ({
      ...previous,
      status,
      page: 1,
    }));
  };

  const columns = React.useMemo(
    () =>
      getOrderColumns({
        onView: handleViewOrder,
      }),
    [handleViewOrder],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Orders Management
          </h2>

          <p className="text-xs text-muted-foreground">
            Manage customer orders and update their delivery status.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleRefresh}
          disabled={isFetching}
          className="gap-2 rounded-xl"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
        {statusFilters.map((filter) => {
          const isActive = params.status === filter.value;

          return (
            <Button
              key={filter.label}
              type="button"
              size="sm"
              variant={isActive ? "default" : "outline"}
              onClick={() => handleStatusFilter(filter.value)}
              className="rounded-xl text-xs"
            >
              {filter.label}
            </Button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-border/60 bg-card">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/60 bg-card py-16">
          <p className="text-sm text-muted-foreground">
            Failed to load orders.
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={handleRefresh}
            className="rounded-xl"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <DataTable columns={columns} data={orders} />
      )}

      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
