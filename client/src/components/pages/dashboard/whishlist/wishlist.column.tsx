"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dataTableFeatures } from "../../../shared/data-table";
import { Wishlist } from "@/types/wishlist";

interface GetWishlistColumnsProps {
  onRemove: (id: string) => void;
  isRemoving: boolean;
}

export const getWishlistColumns = ({
  onRemove,
  isRemoving,
}: GetWishlistColumnsProps): ColumnDef<
  typeof dataTableFeatures,
  Wishlist
>[] => [
  {
    id: "medicine",
    header: "Medicine",
    cell: ({ row }) => {
      const wishlist = row.original;
      const product = wishlist.product;

      return (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted">
            {product?.image ? (
              <Image
                src={product.image}
                alt={product.name || "Medicine"}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                N/A
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">
              {product?.name || "Unknown Medicine"}
            </p>

            <p className="text-xs text-muted-foreground">
              Added{" "}
              {new Date(wishlist.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      );
    },
  },

  {
    id: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.original.product?.price ?? 0;

      return (
        <span className="font-medium text-foreground">
          ৳ {price.toFixed(2)}
        </span>
      );
    },
  },

  {
    id: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.original.product?.stock ?? 0;

      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
            stock <= 0
              ? "bg-destructive/10 text-destructive"
              : stock <= 10
                ? "bg-amber-500/10 text-amber-600"
                : "bg-emerald-500/10 text-emerald-500"
          }`}
        >
          {stock} units
        </span>
      );
    },
  },

  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.product?.status;

      if (!status) {
        return (
          <span className="text-xs text-muted-foreground">
            Unknown
          </span>
        );
      }

      const statusConfig = {
        available: {
          label: "Available",
          className:
            "bg-emerald-500/10 text-emerald-600",
        },
        sold: {
          label: "Sold",
          className:
            "bg-amber-500/10 text-amber-600",
        },
        stockout: {
          label: "Out of Stock",
          className:
            "bg-destructive/10 text-destructive",
        },
      };

      const config = statusConfig[status];

      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}
        >
          {config.label}
        </span>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const wishlist = row.original;

      return (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(wishlist.id)}
          disabled={isRemoving}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          title="Remove from Wishlist"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    },
  },
];