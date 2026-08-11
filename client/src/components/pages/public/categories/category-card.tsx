// src/components/pages/public/categories/category-card.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { FolderKanban } from "lucide-react";
import type { Category } from "@/types/category";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/medicines?categoryId=${category.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/50"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted/30 border border-border/50 flex items-center justify-center">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <FolderKanban className="h-6 w-6 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {category.description || "Browse medicines in this category"}
          </p>
        </div>
      </div>
    </Link>
  );
}