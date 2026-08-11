"use client";

import { MedicineCard } from "@/components/card/medicine-card";
import { SectionHeader } from "../../../shared/section-header";
import { NoData } from "../../../shared/no-data";
import { useProducts } from "@/hooks/use-products";
import type { Product } from "@/types/product";

export function FeaturedMedicines() {
  const { data: response, isLoading, error } = useProducts({ limit: 4 });
  const products: Product[] = response?.data || [];

  return (
    <section className="w-full py-16 px-4 md:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <SectionHeader
          title="Featured Products"
          description="Top requested medicines available through our network."
          actionText="View All"
          actionHref="/medicines"
          align="left"
        />

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-[400px] w-full bg-muted/20 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-muted-foreground">
            Failed to load featured medicines. Please try again later.
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <NoData
            title="No Featured Medicines"
            message="We couldn't find any featured medicines available right now. Please check back later."
          />
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <MedicineCard
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.categoryId}
                price={product.price}
                image={product.image || ""}
                manufacturer={product.manufacturer}
                stock={product.stock}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
