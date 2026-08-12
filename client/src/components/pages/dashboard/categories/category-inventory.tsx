"use client";

import * as React from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryRow } from "../../../../types/category";
import { useCategories } from "../../../../hooks/use-categories";
import { CategoryFilters } from "./category-filters";
import { CategoryTable } from "./category-table";
import { CategoryModal } from "./category-modal";

interface CategoryInventoryProps {
  initialData?: CategoryRow[];
}

export default function CategoryInventory({
  initialData,
}: CategoryInventoryProps) {
  const {
    categories,
    isLoading,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    modalMode,
    activeCategory,
    isSubmitting,
    imagePreview,
    imageFile,
    handleOpenAddModal,
    handleOpenEditModal,
    handleImageChange,
    handleRemoveImage,
    handleDeleteCategory,
    handleFormSubmit,
  } = useCategories(initialData);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Category Inventory
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage your pharmacy categories and inventory groupings.
          </p>
        </div>

        <Button
          onClick={handleOpenAddModal}
          className="gap-2 rounded-xl shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <CategoryFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {isLoading ? (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-border/60 bg-card">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteCategory}
        />
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        mode={modalMode}
        activeCategory={activeCategory}
        imagePreview={imagePreview}
        imageFile={imageFile}
        isSubmitting={isSubmitting}
        onImageChange={handleImageChange}
        onRemoveImage={handleRemoveImage}
      />
    </div>
  );
}
