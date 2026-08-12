"use client";

import * as React from "react";
import { toast } from "sonner";

import { uploadImageToImgBB } from "@/lib/upload-image";
import { categoryService } from "@/services/category.service";

import type { CategoryFormData, CategoryRow } from "../types/category";

export function useCategories(initialData?: CategoryRow[]) {
  const [categories, setCategories] = React.useState<CategoryRow[]>(
    initialData || [],
  );
  const [isLoading, setIsLoading] = React.useState(!initialData);
  const [searchQuery, setSearchQuery] = React.useState("");

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");
  const [activeCategory, setActiveCategory] =
    React.useState<CategoryRow | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState("");

  const fetchCategories = React.useCallback(async () => {
    try {
      setIsLoading(true);

      const result = await categoryService.getCategories();

      setCategories(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while fetching categories",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!initialData) {
      setTimeout(() => fetchCategories(), 0);
    }
  }, [fetchCategories, initialData]);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setActiveCategory(null);
    setImagePreview("");
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: CategoryRow) => {
    setModalMode("edit");
    setActiveCategory(category);
    setImagePreview(category.image || "");
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const result = await categoryService.deleteCategory(id);

      setCategories((prev) => prev.filter((item) => item.id !== id));

      toast.success(result.message || "Category deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while deleting the category",
      );
    }
  };

  const handleFormSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true);

      let finalImageUrl = imagePreview;

      if (imageFile) {
        toast.loading("Uploading image to ImgBB...", {
          id: "cat-img-upload",
        });

        try {
          finalImageUrl = await uploadImageToImgBB(imageFile);

          toast.success("Image uploaded successfully", {
            id: "cat-img-upload",
          });
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Image upload failed",
            {
              id: "cat-img-upload",
            },
          );

          setIsSubmitting(false);
          return;
        }
      }

      if (modalMode === "add") {
        const result = await categoryService.createCategory({
          name: data.name,
          description: data.description,
          image: finalImageUrl,
        });

        setCategories((prev) => [result.data, ...prev]);

        toast.success(result.message || "Category created successfully");

        setIsModalOpen(false);
      }

      if (modalMode === "edit" && activeCategory) {
        const result = await categoryService.updateCategory(activeCategory.id, {
          name: data.name,
          description: data.description,
          image: finalImageUrl,
        });

        setCategories((prev) =>
          prev.map((item) =>
            item.id === activeCategory.id ? result.data : item,
          ),
        );

        toast.success(result.message || "Category updated successfully");

        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while saving the category",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = React.useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [categories, searchQuery]);

  return {
    categories: filteredCategories,
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
  };
}
