"use client";

import * as React from "react";
import { Heart, Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";

import {
  useWishlist,
  useRemoveFromWishlist,
} from "@/hooks/use-wishlist";

import type { Wishlist } from "@/types/wishlist";

import { getWishlistColumns } from "./wishlist.column";

export default function WishlistClient() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const {
    data: response,
    isLoading,
    isError,
  } = useWishlist({
    page: 1,
    limit: 100,
    sortOrder: "desc",
  });

  const removeWishlist = useRemoveFromWishlist();

  const wishlistItems = React.useMemo<Wishlist[]>(() => {
    if (!response?.data) {
      return [];
    }

    return Array.isArray(response.data) ? response.data : [];
  }, [response]);

  const filteredWishlist = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return wishlistItems;
    }

    return wishlistItems.filter((item) =>
      item.product?.name?.toLowerCase().includes(query),
    );
  }, [wishlistItems, searchQuery]);

  const handleRemove = async (id: string) => {
    try {
      await removeWishlist.mutateAsync(id);

      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to remove from wishlist",
      );
    }
  };

  const columns = React.useMemo(
    () =>
      getWishlistColumns({
        onRemove: handleRemove,
        isRemoving: removeWishlist.isPending,
      }),
    [removeWishlist.isPending],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />

            <h2 className="text-xl font-bold tracking-tight text-foreground">
              My Wishlist
            </h2>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Manage your saved medicines and products.
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card px-4 py-2 text-xs text-muted-foreground shadow-sm">
          {wishlistItems.length}{" "}
          {wishlistItems.length === 1 ? "item" : "items"}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search wishlist..."
            className="rounded-xl pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-56 items-center justify-center rounded-2xl border border-border/60 bg-card">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="flex h-56 items-center justify-center rounded-2xl border border-border/60 bg-card">
          <p className="text-sm text-muted-foreground">
            Failed to load wishlist.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredWishlist}
        />
      )}
    </div>
  );
}