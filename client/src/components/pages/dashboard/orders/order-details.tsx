"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  MapPin,
  Package,
  Phone,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  useOrder,
  useUpdateOrderStatus,
} from "@/hooks/use-orders";
import type { OrderStatus } from "@/types/order";

interface OrderDetailsProps {
  id: string;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Pending",
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-600",
  },
  confirmed: {
    label: "Confirmed",
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-600",
  },
  shipped: {
    label: "Shipped",
    className:
      "border-purple-500/20 bg-purple-500/10 text-purple-600",
  },
  delivered: {
    label: "Delivered",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "border-destructive/20 bg-destructive/10 text-destructive",
  },
};

const getNextStatuses = (
  status: OrderStatus,
): OrderStatus[] => {
  switch (status) {
    case "pending":
      return ["confirmed", "cancelled"];

    case "confirmed":
      return ["shipped"];

    case "shipped":
      return ["delivered"];

    case "delivered":
    case "cancelled":
      return [];

    default:
      return [];
  }
};

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case "confirmed":
      return "Confirm Order";

    case "shipped":
      return "Mark as Shipped";

    case "delivered":
      return "Mark as Delivered";

    case "cancelled":
      return "Cancel Order";

    default:
      return status;
  }
};

function StatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export function OrderDetails({
  id,
}: OrderDetailsProps) {
  const {
    data: response,
    isLoading,
    error,
  } = useOrder(id);

  const updateStatus = useUpdateOrderStatus();

  const order = response?.data;

  const handleStatusUpdate = async (
    status: OrderStatus,
  ) => {
    try {
      await updateStatus.mutateAsync({
        id: order!.id,
        data: {
          status,
        },
      });

      toast.success(
        `Order ${status} successfully`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update order status",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-muted/30" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-[500px] animate-pulse rounded-2xl bg-muted/20 lg:col-span-2" />

          <div className="h-[500px] animate-pulse rounded-2xl bg-muted/20" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-border/60 bg-card">
        <Package className="mb-4 h-10 w-10 text-muted-foreground" />

        <h2 className="text-lg font-semibold">
          Order Not Found
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          This order does not exist or could not be loaded.
        </p>

        <Link
          href="/dashboard/orders"
          className="mt-5"
        >
          <Button
            variant="outline"
            className="rounded-xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const nextStatuses = getNextStatuses(
    order.status,
  );

  const totalItems = order.orderItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/dashboard/orders"
            className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Order Details
            </h1>

            <StatusBadge status={order.status} />
          </div>

          <p className="mt-1 break-all text-xs text-muted-foreground">
            Order ID: {order.id}
          </p>
        </div>

        {nextStatuses.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {nextStatuses.map((status) => (
              <Button
                key={status}
                onClick={() =>
                  handleStatusUpdate(status)
                }
                disabled={updateStatus.isPending}
                variant={
                  status === "cancelled"
                    ? "destructive"
                    : "default"
                }
                className="rounded-xl"
              >
                {updateStatus.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                {getStatusLabel(status)}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="border-b border-border/60 p-5">
              <h2 className="font-semibold">
                Order Items
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {totalItems} item
                {totalItems !== 1 ? "s" : ""} in this
                order
              </p>
            </div>

            <div className="divide-y divide-border/50">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        Product #{item.productId}
                      </p>

                      <p className="mt-1 break-all text-xs text-muted-foreground">
                        Product ID: {item.productId}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold">
                      ৳{" "}
                      {(
                        item.price *
                        item.quantity
                      ).toFixed(2)}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      ৳ {item.price.toFixed(2)} ×{" "}
                      {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-5 py-4">
              <span className="font-semibold">
                Total Amount
              </span>

              <span className="text-xl font-bold text-primary">
                ৳ {order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Customer Information
                </h2>

                <p className="text-xs text-muted-foreground">
                  Customer who placed this order
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  Customer ID
                </p>

                <p className="mt-1 break-all text-sm font-medium">
                  {order.userId}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Phone
                </p>

                <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {order.phone}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs text-muted-foreground">
                  Shipping Address
                </p>

                <p className="mt-1 flex items-start gap-2 text-sm font-medium">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>
                    {order.shippingAddress}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <h2 className="mb-5 font-semibold">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Status
                </span>

                <StatusBadge
                  status={order.status}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Items
                </span>

                <span className="text-sm font-semibold">
                  {totalItems}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total
                </span>

                <span className="text-lg font-bold text-primary">
                  ৳{" "}
                  {order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <h2 className="mb-5 font-semibold">
              Order Timeline
            </h2>

            <div className="space-y-5">
              <div className="flex gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                <div>
                  <p className="text-xs text-muted-foreground">
                    Created
                  </p>

                  <p className="text-sm font-medium">
                    {formatDateTime(
                      order.createdAt,
                    )}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                <div>
                  <p className="text-xs text-muted-foreground">
                    Last Updated
                  </p>

                  <p className="text-sm font-medium">
                    {formatDateTime(
                      order.updatedAt,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Actions */}
          {nextStatuses.length > 0 && (
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
              <h2 className="font-semibold">
                Update Status
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Update the current order status.
              </p>

              <div className="mt-4 space-y-2">
                {nextStatuses.map((status) => (
                  <Button
                    key={status}
                    variant={
                      status === "cancelled"
                        ? "destructive"
                        : "outline"
                    }
                    disabled={
                      updateStatus.isPending
                    }
                    onClick={() =>
                      handleStatusUpdate(status)
                    }
                    className="w-full rounded-xl"
                  >
                    {updateStatus.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}

                    {getStatusLabel(status)}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}