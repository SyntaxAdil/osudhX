"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Package,
  Building2,
  Tag,
  ShieldCheck,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { toast } from "sonner";

import { useProduct } from "@/hooks/use-products";
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "@/hooks/use-wishlist";

import { NoData } from "@/components/shared/no-data";
import { Button } from "@/components/ui/button";
import { MedicineOrderModal } from "./medicine-order-modal";

interface MedicineDetailContainerProps {
  id: string;
}

export function MedicineDetailContainer({
  id,
}: MedicineDetailContainerProps) {
  const { data: response, isLoading, error } = useProduct(id);

  const product = response?.data;

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const { data: wishlistResponse } = useWishlist({
    limit: 100,
  });

  const wishlistItems = wishlistResponse?.data ?? [];

  const wishlistItem = product
    ? wishlistItems.find((item) => item.productId === product.id)
    : undefined;

  const isWishlisted = Boolean(wishlistItem);

  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const handleWishlist = async () => {
    if (!product) {
      return;
    }

    try {
      if (wishlistItem) {
        await removeFromWishlist.mutateAsync(wishlistItem.id);

        toast.success("Removed from wishlist");
      } else {
        await addToWishlist.mutateAsync({
          productId: product.id,
        });

        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update wishlist",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 items-center gap-12 py-12 lg:grid-cols-2">
        <div className="h-[400px] w-full animate-pulse rounded-2xl bg-muted/20 lg:h-[480px]" />

        <div className="space-y-4">
          <div className="h-8 w-3/4 animate-pulse rounded-lg bg-muted/20" />

          <div className="h-6 w-1/4 animate-pulse rounded-lg bg-muted/20" />

          <div className="h-24 w-full animate-pulse rounded-lg bg-muted/20" />

          <div className="h-12 w-full animate-pulse rounded-xl bg-muted/20" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-12">
        <NoData
          title="Product Not Found"
          message="The medicine you are looking for does not exist or has been removed."
        />
      </div>
    );
  }

  const isAvailable =
    product.stock > 0 && product.status === "available";

  const isWishlistPending =
    addToWishlist.isPending || removeFromWishlist.isPending;

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-12 py-6 lg:grid-cols-2">
        <div className="relative flex h-[400px] w-full items-center justify-center overflow-hidden rounded-3xl border border-border/60 bg-muted/20 lg:h-[480px]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <Package className="h-20 w-20 text-muted-foreground/40" />
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                  product.status === "available"
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                    : "border-destructive/20 bg-destructive/10 text-destructive"
                }`}
              >
                {product.status.toUpperCase()}
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                <Package className="h-3.5 w-3.5" />
                Stock: {product.stock} units
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              {product.name}
            </h1>

            <div className="mt-4 text-3xl font-bold text-primary">
              ৳ {product.price}
            </div>
          </div>

          <div className="space-y-3 border-y border-border/60 py-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 shrink-0 text-foreground" />

              <span>
                Manufacturer:{" "}
                <strong className="text-foreground">
                  {product.manufacturer}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Tag className="h-4 w-4 shrink-0 text-foreground" />

              <span>
                Category ID:{" "}
                <strong className="text-foreground">
                  {product.categoryId}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />

              <span>100% Genuine & Quality Verified</span>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-foreground">
              Description
            </h3>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description ||
                "No description provided for this medicine."}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleWishlist}
              disabled={isWishlistPending}
              aria-label={
                isWishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              className="h-12 w-12 shrink-0 rounded-xl"
            >
              <Heart
                className={`h-5 w-5 ${
                  isWishlisted
                    ? "fill-current text-red-500"
                    : "text-foreground"
                }`}
              />
            </Button>

            <Button
              type="button"
              disabled={!isAvailable}
              onClick={() => setIsOrderModalOpen(true)}
              className="h-12 flex-1 cursor-pointer gap-2 rounded-xl text-base font-medium"
            >
              <ShoppingCart className="h-5 w-5" />

              {product.stock <= 0
                ? "Out of Stock"
                : product.status !== "available"
                  ? "Currently Unavailable"
                  : "Order Now"}
            </Button>
          </div>
        </div>
      </div>

      <MedicineOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        productId={product.id}
        productName={product.name}
        price={product.price}
        stock={product.stock}
      />
    </>
  );
}