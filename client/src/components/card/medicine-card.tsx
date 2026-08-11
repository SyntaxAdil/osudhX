"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MedicineCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  manufacturer?: string;
  stock?: number;
}

export function MedicineCard({
  id,
  name,
  category,
  price,
  image,
  manufacturer,
  stock = 0,
}: MedicineCardProps) {
  const inStock = stock > 0;

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
      {/* Product Image Area */}
      <div className="relative w-full h-48 overflow-hidden bg-muted/30">
        {/* Category Badge */}
        <Badge
          variant="secondary"
          className="absolute left-4 top-4 z-10 rounded-full border border-border/50 bg-background/90 px-3 py-1 text-[10px] font-medium uppercase tracking-wider backdrop-blur-sm"
        >
          {category}
        </Badge>

        {/* Stock Badge */}
        {!inStock && (
          <Badge
            variant="destructive"
            className="absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-[10px] font-medium"
          >
            Out of stock
          </Badge>
        )}

        {/* Image Container - Full width and height with object-cover */}
        <div className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Product Info Section */}
      <div className="flex flex-col justify-between p-5 space-y-4 flex-1">
        <div className="space-y-1">
          <h3 className="line-clamp-1 text-base font-semibold tracking-tight text-foreground" title={name}>
            {name}
          </h3>

          {manufacturer && (
            <p className="line-clamp-1 text-xs text-muted-foreground" title={manufacturer}>
              {manufacturer}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 pt-2">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Price
            </p>

            <p className="mt-0.5 text-xl font-bold tracking-tight text-foreground">
              ৳ {price.toLocaleString("en-BD")}
            </p>
          </div>

          <Link href={`/medicines/${id}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 gap-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
              <span>Details</span>
            </Button>
          </Link>
        </div>

        {/* Stock Indicator */}
        {inStock && (
          <div className="flex items-center gap-2 border-t border-border/50 pt-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-muted-foreground">
              {stock > 10 ? "In stock" : `Only ${stock} left`}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}