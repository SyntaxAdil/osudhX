"use client";

import * as React from "react";
import { Loader2, Package, Phone, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateOrderStatus } from "@/hooks/use-orders";
import type { Order, OrderStatus } from "@/types/order";
import { toast } from "sonner";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
}: OrderDetailModalProps) {
  const updateStatus = useUpdateOrderStatus();

  if (!order) {
    return null;
  }

  const handleStatusChange = async (status: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({
        id: order.id,
        data: { status },
      });

      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update order status",
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Order #{order.id.slice(0, 8)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-border/60 p-4">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />

              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Shipping Address
                </p>

                <p className="mt-1 text-sm font-medium text-foreground">
                  {order.shippingAddress}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border/60 p-4">
              <Phone className="mt-0.5 h-4 w-4 text-primary" />

              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Phone
                </p>

                <p className="mt-1 text-sm font-medium text-foreground">
                  {order.phone}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Order Items
              </h3>

              <span className="text-sm font-bold text-primary">
                ৳ {order.totalAmount.toFixed(2)}
              </span>
            </div>

            <div className="space-y-2">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Product #{item.productId.slice(0, 8)}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-semibold text-foreground">
                    ৳ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              Update Order Status
            </p>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {statuses.map((status) => (
                <Button
                  key={status}
                  type="button"
                  variant={order.status === status ? "default" : "outline"}
                  size="sm"
                  disabled={
                    updateStatus.isPending ||
                    order.status === status
                  }
                  onClick={() => handleStatusChange(status)}
                  className="rounded-xl text-xs capitalize"
                >
                  {updateStatus.isPending &&
                  updateStatus.variables?.data.status === status ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    status
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end border-t border-border/60 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}