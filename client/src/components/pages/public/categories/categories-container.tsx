// src/components/pages/public/categories/categories-container.tsx
"use client";

import { CategoryCard } from "./category-card";
import { NoData } from "@/components/shared/no-data";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCategories } from "../../../../hooks/use-categories";

export function CategoriesContainer() {
  const {
    categories,
    isLoading,
    searchQuery,
    setSearchQuery,
  } = useCategories();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border/60 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      {!isLoading && categories.length === 0 && (
        <NoData
          title="No Categories Found"
          message="We couldn't find any categories matching your search criteria."
        />
      )}

      {!isLoading && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}