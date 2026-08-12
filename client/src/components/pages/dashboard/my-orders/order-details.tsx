"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCancelOrder, useOrder } from "@/hooks/use-orders";
import type { OrderStatus } from "@/types/order";

interface OrderDetailsProps {
  id: string;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    className: string;
    icon: React.ElementType;
  }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-500/10 text-amber-600 border-amber-500/20",
    icon: Clock3,
  },
  confirmed: {
    label: "Confirmed",
    className:
      "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: CheckCircle2,
  },
  shipped: {
    label: "Shipped",
    className:
      "bg-purple-500/10 text-purple-600 border-purple-500/20",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    className:
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
  },
};

export default function OrderDetails({
  id,
}: OrderDetailsProps) {
  const {
    data: response,
    isLoading,
    error,
  } = useOrder(id);

  const cancelOrder = useCancelOrder();

  const order = response?.data;

  const handleCancelOrder = async () => {
    if (!order) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await cancelOrder.mutateAsync(order.id);

      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to cancel order",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-muted/30" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-72 animate-pulse rounded-2xl bg-muted/30 lg:col-span-2" />

          <div className="h-72 animate-pulse rounded-2xl bg-muted/30" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-border/60 bg-card px-6 text-center">
        <Package className="mb-4 h-10 w-10 text-muted-foreground" />

        <h2 className="text-lg font-semibold">
          Order Not Found
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          This order does not exist or could not be loaded.
        </p>

        <Link href="/dashboard/my-orders" className="mt-5">
          <Button variant="outline" className="rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Orders
          </Button>
        </Link>
      </div>
    );
  }

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  const canCancel =
    order.status === "pending" ||
    order.status === "confirmed";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard/my-order"
            className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Orders
          </Link>

          <h1 className="text-2xl font-bold tracking-tight">
            Order Details
          </h1>

          <p className="mt-1 text-xs text-muted-foreground">
            Order #{order.id.slice(0, 8)}
          </p>
        </div>

        <span
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="border-b border-border/60 px-5 py-4">
              <h2 className="font-semibold">
                Order Items
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {order.orderItems?.length ?? 0} item
                {(order.orderItems?.length ?? 0) !== 1
                  ? "s"
                  : ""}{" "}
                in this order
              </p>
            </div>

            <div className="divide-y divide-border/50">
              {order.orderItems?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-5"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-muted/30">
                    <Package className="h-7 w-7 text-muted-foreground/50" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      Medicine
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Product ID: {item.productId.slice(0, 8)}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      ৳{" "}
                      {(
                        Number(item.price) *
                        item.quantity
                      ).toFixed(2)}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      ৳ {Number(item.price).toFixed(2)} ×{" "}
                      {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border/60 bg-muted/20 px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Total Amount
                </span>

                <span className="text-xl font-bold text-primary">
                  ৳ {Number(order.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <h2 className="font-semibold">
              Order Information
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  Order ID
                </p>

                <p className="mt-1 break-all text-sm font-medium">
                  {order.id}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Order Date
                </p>

                <p className="mt-1 text-sm font-medium">
                  {new Date(
                    order.createdAt,
                  ).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Last Updated
                </p>

                <p className="mt-1 text-sm font-medium">
                  {new Date(
                    order.updatedAt,
                  ).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Status
                </p>

                <p className="mt-1 text-sm font-medium capitalize">
                  {order.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <h2 className="font-semibold">
              Delivery Information
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  Shipping Address
                </p>

                <p className="mt-1 text-sm leading-relaxed font-medium">
                  {order.shippingAddress}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Phone Number
                </p>

                <p className="mt-1 text-sm font-medium">
                  {order.phone}
                </p>
              </div>
            </div>
          </div>

          {canCancel && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
              <h3 className="text-sm font-semibold">
                Cancel Order
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                You can cancel this order while it is still
                pending or confirmed.
              </p>

              <Button
                type="button"
                variant="destructive"
                onClick={handleCancelOrder}
                disabled={cancelOrder.isPending}
                className="mt-4 w-full rounded-xl"
              >
                {cancelOrder.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Order
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <h2 className="font-semibold">
              Order Summary
            </h2>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Items
                </span>

                <span className="font-medium">
                  {order.orderItems?.length ?? 0}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Status
                </span>

                <span className="font-medium capitalize">
                  {order.status}
                </span>
              </div>

              <div className="border-t border-border/60 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold">
                    Total
                  </span>

                  <span className="font-bold text-primary">
                    ৳ {Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}