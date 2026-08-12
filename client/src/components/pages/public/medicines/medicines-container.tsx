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

  const {
    categories,
    isLoading: categoriesLoading,
  } = useCategories();

  const safeCategories = Array.isArray(categories)
    ? categories
    : [];

  const apiParams: ProductQueryParams = {
    ...params,
    categoryId:
      params.categoryId === "all"
        ? undefined
        : params.categoryId,
  };

  const {
    data: productsResponse,
    isLoading: productsLoading,
    error,
  } = useProducts(apiParams);

  const products: Product[] = Array.isArray(productsResponse?.data)
    ? productsResponse.data
    : [];

  const meta = productsResponse?.meta;

  const isLoading = categoriesLoading || productsLoading;

  const handleSearchChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      categoryId: value,
      page: 1,
    }));
  };

  const handleSortByChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      sortBy: value,
      page: 1,
    }));
  };

  const handleSortOrderChange = (value: "asc" | "desc") => {
    setParams((prev) => ({
      ...prev,
      sortOrder: value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({
      ...prev,
      page: newPage,
    }));
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
        categories={safeCategories}
      />

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="h-[380px] w-full animate-pulse rounded-2xl bg-muted/20"
            />
          ))}
        </div>
      )}

      {error && !isLoading && (
        <div className="py-12 text-center text-muted-foreground">
          Failed to load medicines. Please try refreshing or check back
          later.
        </div>
      )}

      {!isLoading && !error && products.length === 0 && (
        <NoData
          title="No Medicines Found"
          message="We couldn't find any products matching your selected search or filter criteria."
        />
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        <MedicinePagination
          meta={meta}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}