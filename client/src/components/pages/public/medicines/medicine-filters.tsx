"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import type { Category } from "@/types/category";

interface MedicineFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
  categories: Category[];
}

export function MedicineFilters({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  categories,
}: MedicineFiltersProps) {
  const getCategoryName = (id: string) => {
    if (id === "all") return "All Categories";
    const found = categories.find((c) => c.id === id);
    return found ? found.name : "All Categories";
  };

  const getSortByName = (sort: string) => {
    switch (sort) {
      case "price":
        return "Price";
      case "name":
        return "Product Name";
      case "createdAt":
      default:
        return "Date Added";
    }
  };

  const getSortOrderName = (order: "asc" | "desc") => {
    return order === "desc" ? "Newest First" : "Oldest First";
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border/60 shadow-sm">
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search medicines by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 rounded-xl border-border/60 focus-visible:ring-primary"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <Select
          value={categoryId}
          onValueChange={(val) => onCategoryChange(val ?? "all")}
        >
          <SelectTrigger className="w-full sm:w-[190px] rounded-xl border-border/60">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue>{getCategoryName(categoryId)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(val) => val && onSortByChange(val)}
        >
          <SelectTrigger className="w-full sm:w-[160px] rounded-xl border-border/60">
            <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue>{getSortByName(sortBy)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date Added</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="name">Product Name</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(val) => {
            if (val === "asc" || val === "desc") {
              onSortOrderChange(val);
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-[150px] rounded-xl border-border/60">
            <SelectValue>{getSortOrderName(sortOrder)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}