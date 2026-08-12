import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CategoryFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function CategoryFilters({ searchQuery, onSearchChange }: CategoryFiltersProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:flex-row">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          className="rounded-xl pl-9"
        />
      </div>
    </div>
  );
}