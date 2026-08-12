"use client";

import * as React from "react";
import { Loader2, MapPin, Phone, ShoppingCart } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useCreateOrder } from "@/hooks/use-orders";

interface MedicineOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  price: number;
  stock: number;
}

interface OrderFormData {
  quantity: number;
  phone: string;
  shippingAddress: string;
}

export function MedicineOrderModal({
  isOpen,
  onClose,
  productId,
  productName,
  price,
  stock,
}: MedicineOrderModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const createOrder = useCreateOrder();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    defaultValues: {
      quantity: 1,
      phone: "",
      shippingAddress: "",
    },
  });

  const quantity = watch("quantity") || 1;
  const totalAmount = price * quantity;

  React.useEffect(() => {
    if (isOpen) {
      reset({
        quantity: 1,
        phone: "",
        shippingAddress: "",
      });
    }
  }, [isOpen, reset]);

  const handleFormSubmit = async (data: OrderFormData) => {
    if (data.quantity > stock) {
      toast.error(`Only ${stock} units are available.`);
      return;
    }

    try {
      setIsSubmitting(true);

      await createOrder.mutateAsync({
        shippingAddress: data.shippingAddress.trim(),
        phone: data.phone.trim(),
        items: [
          {
            productId,
            quantity: Number(data.quantity),
          },
        ],
      });

      toast.success("Order placed successfully");

      reset();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to place order",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Place Order
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {productName}
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  ৳ {price} per unit
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  Available
                </p>

                <p className="text-sm font-semibold text-foreground">
                  {stock} units
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-semibold">
                Quantity
                <span className="text-destructive">*</span>
              </label>

              <Input
                type="number"
                min={1}
                max={stock}
                {...register("quantity", {
                  required: "Quantity is required",
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: "Quantity must be at least 1",
                  },
                  max: {
                    value: stock,
                    message: `Only ${stock} units are available`,
                  },
                })}
                className="h-10 rounded-xl"
              />

              {errors.quantity && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-semibold">
                <Phone className="h-3.5 w-3.5" />
                Phone Number
                <span className="text-destructive">*</span>
              </label>

              <Input
                type="tel"
                placeholder="01XXXXXXXXX"
                {...register("phone", {
                  required: "Phone number is required",
                  minLength: {
                    value: 10,
                    message: "Please enter a valid phone number",
                  },
                })}
                className="h-10 rounded-xl"
              />

              {errors.phone && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-semibold">
                <MapPin className="h-3.5 w-3.5" />
                Shipping Address
                <span className="text-destructive">*</span>
              </label>

              <Textarea
                placeholder="Enter your complete delivery address"
                {...register("shippingAddress", {
                  required: "Shipping address is required",
                  minLength: {
                    value: 10,
                    message: "Please enter a complete address",
                  },
                })}
                className="h-24 resize-none rounded-xl"
              />

              {errors.shippingAddress && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.shippingAddress.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  Total Amount
                </p>

                <p className="text-xl font-bold text-primary">
                  ৳ {totalAmount.toFixed(2)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  Quantity
                </p>

                <p className="text-sm font-semibold">
                  {quantity}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-10 rounded-xl px-4 text-xs"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || stock <= 0}
                className="h-10 gap-2 rounded-xl px-5 text-xs"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}

                {isSubmitting ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}