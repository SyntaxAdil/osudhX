"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@/types/product";

interface MedicinePaginationProps {
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function MedicinePagination({ meta, onPageChange }: MedicinePaginationProps) {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-border/60">
      <p className="text-sm text-muted-foreground">
        Showing page <span className="font-semibold text-foreground">{meta.page}</span> of{" "}
        <span className="font-semibold text-foreground">{meta.totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
          className="rounded-xl h-9 px-3"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
          className="rounded-xl h-9 px-3"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}