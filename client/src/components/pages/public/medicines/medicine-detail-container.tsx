// src/components/pages/public/medicines/medicine-detail-container.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useProduct } from "@/hooks/use-products";
import { NoData } from "@/components/shared/no-data";
import { Button } from "@/components/ui/button";
import { Package, Building2, Tag, ShieldCheck, ShoppingCart } from "lucide-react";

interface MedicineDetailContainerProps {
  id: string;
}

export function MedicineDetailContainer({ id }: MedicineDetailContainerProps) {
  const { data: response, isLoading, error } = useProduct(id);
  const product = response?.data;
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
        <div className="h-[400px] w-full bg-muted/20 animate-pulse rounded-2xl" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-muted/20 animate-pulse rounded-lg" />
          <div className="h-6 w-1/4 bg-muted/20 animate-pulse rounded-lg" />
          <div className="h-24 w-full bg-muted/20 animate-pulse rounded-lg" />
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start py-6">
      {/* Product Image Section */}
      <div className="relative h-[400px] lg:h-[480px] w-full overflow-hidden rounded-3xl border border-border/60 bg-muted/20 flex items-center justify-center">
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

      {/* Product Info Section */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                product.status === "available"
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}
            >
              {product.status.toUpperCase()}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
              <Package className="h-3.5 w-3.5" /> Stock: {product.stock} units
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            {product.name}
          </h1>

          <div className="mt-4 text-3xl font-bold text-primary">
            ৳ {product.price}
          </div>
        </div>

        <div className="space-y-3 py-4 border-y border-border/60">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 text-foreground" />
            <span>Manufacturer: <strong className="text-foreground">{product.manufacturer}</strong></span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Tag className="h-4 w-4 text-foreground" />
            <span>Category ID: <strong className="text-foreground">{product.categoryId}</strong></span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>100% Genuine & Quality Verified</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
            Description
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description || "No description provided for this medicine."}
          </p>
        </div>

        {/* Quantity & Action */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">Quantity:</span>
            <div className="flex items-center border border-border rounded-xl overflow-hidden bg-card">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 text-foreground hover:bg-muted transition-colors"
              >
                -
              </button>
              <span className="px-4 py-1.5 text-sm font-semibold text-foreground min-w-[40px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-1.5 text-foreground hover:bg-muted transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <Button
            disabled={product.stock <= 0 || product.status !== "available"}
            className="w-full h-12 rounded-xl text-base font-medium gap-2 cursor-pointer"
          >
            <ShoppingCart className="h-5 w-5" />
            {product.stock > 0 ? "Add to Order / Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
}