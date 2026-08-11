// src/components/pages/public/categories/categories-container.tsx
"use client";

import { useState } from "react";
import { CategoryCard } from "./category-card";
import { NoData } from "@/components/shared/no-data";
import { useCategories } from "@/hooks/use-categories";
import type { Category, CategoryQueryParams } from "@/types/category";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function CategoriesContainer() {
  const [params, setParams] = useState<CategoryQueryParams>({
    page: 1,
    limit: 12,
    search: "",
    sortOrder: "desc",
  });

  const { data: response, isLoading, error } = useCategories(params);
  const categories: Category[] = response?.data || [];

  const handleSearchChange = (value: string) => {
    setParams((prev) => ({ ...prev, search: value, page: 1 }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border/60 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={params.search || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 rounded-xl border-border/60 focus-visible:ring-primary"
          />
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 w-full bg-muted/20 animate-pulse rounded-2xl" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-12 text-muted-foreground">
          Failed to load categories. Please try refreshing or check back later.
        </div>
      )}

      {!isLoading && !error && categories.length === 0 && (
        <NoData
          title="No Categories Found"
          message="We couldn't find any categories matching your search criteria."
        />
      )}

      {!isLoading && !error && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}