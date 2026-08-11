"use client";

import { useState } from "react";
import { MedicineCard } from "@/components/card/medicine-card";
import { NoData } from "@/components/shared/no-data";
import { MedicineFilters } from "./medicine-filters";
import { MedicinePagination } from "./medicine-pagination";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import type { Product, ProductQueryParams } from "@/types/product";

export function MedicinesContainer() {
  const [params, setParams] = useState<ProductQueryParams>({
    page: 1,
    limit: 12,
    search: "",
    categoryId: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: categoriesResponse } = useCategories({ limit: 100 });
  const categories = categoriesResponse?.data || [];

  const apiParams: ProductQueryParams = {
    ...params,
    categoryId: params.categoryId === "all" ? undefined : params.categoryId,
  };

  const { data: productsResponse, isLoading, error } = useProducts(apiParams);
  const products: Product[] = productsResponse?.data || [];
  const meta = productsResponse?.meta;

  const handleSearchChange = (value: string) => {
    setParams((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleCategoryChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      categoryId: value,
      page: 1,
    }));
  };

  const handleSortByChange = (value: string) => {
    setParams((prev) => ({ ...prev, sortBy: value, page: 1 }));
  };

  const handleSortOrderChange = (value: "asc" | "desc") => {
    setParams((prev) => ({ ...prev, sortOrder: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-8">
      <MedicineFilters
        search={params.search || ""}
        onSearchChange={handleSearchChange}
        categoryId={params.categoryId || "all"}
        onCategoryChange={handleCategoryChange}
        sortBy={params.sortBy || "createdAt"}
        onSortByChange={handleSortByChange}
        sortOrder={params.sortOrder || "desc"}
        onSortOrderChange={handleSortOrderChange}
        categories={categories}
      />

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[380px] w-full bg-muted/20 animate-pulse rounded-2xl" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-12 text-muted-foreground">
          Failed to load medicines. Please try refreshing or check back later.
        </div>
      )}

      {!isLoading && !error && products.length === 0 && (
        <NoData
          title="No Medicines Found"
          message="We couldn't find any products matching your selected search or filter criteria."
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

      {!isLoading && !error && (
        <MedicinePagination meta={meta} onPageChange={handlePageChange} />
      )}
    </div>
  );
}