"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MedicineRow } from "./medicine.column";
import { Loader2, Upload, X } from "lucide-react";
import { uploadImageToImgBB } from "@/lib/upload-image";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

interface CategoryResponse {
  id: string;
  name: string;
}

interface ApiCategoryResponse {
  success: boolean;
  data: CategoryResponse[];
}

interface MedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    manufacturer: string;
    category: string;
  }) => Promise<void>;
  initialData: MedicineRow | null;
  mode: "add" | "edit";
}

interface FormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  manufacturer: string;
  category: string;
}

export function MedicineModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: MedicineModalProps) {
  const [categories, setCategories] = React.useState<CategoryResponse[]>([]);
  const [isFetchingCategories, setIsFetchingCategories] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      manufacturer: "",
      category: "",
    },
  });

  React.useEffect(() => {
    if (!isOpen) return;

    const fetchCategories = async () => {
      try {
        setIsFetchingCategories(true);

        const result = await apiFetch<ApiCategoryResponse>("/api/categories");

        if (result.success) {
          setCategories(result.data);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load categories",
        );
      } finally {
        setIsFetchingCategories(false);
      }
    };

    fetchCategories();

    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || 0,
        stock: initialData.stock || 0,
        manufacturer: initialData.manufacturer || "",
        category: initialData.categoryId || "",
      });

      setTimeout(() => setImagePreview(initialData.image || ""), 0);
      setTimeout(() => setImageFile(null), 0);
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        manufacturer: "",
        category: "",
      });
      setTimeout(() => setImagePreview(""), 0);
      setTimeout(() => setImageFile(null), 0);
    }
  }, [isOpen, mode, initialData, reset]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleFormSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      let finalImageUrl = imagePreview;

      if (imageFile) {
        toast.loading("Uploading image to ImgBB...", {
          id: "img-upload",
        });

        try {
          finalImageUrl = await uploadImageToImgBB(imageFile);

          toast.success("Image uploaded successfully", {
            id: "img-upload",
          });
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Image upload failed",
            {
              id: "img-upload",
            },
          );

          return;
        }
      }

      if (!finalImageUrl) {
        toast.error("Medicine image is required");
        return;
      }

      await onSubmit({
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        manufacturer: data.manufacturer,
        category: data.category,
        image: finalImageUrl,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:max-w-lg">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-bold">
            {mode === "add" ? "Add New Medicine" : "Edit Medicine"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-semibold text-foreground">
              Medicine Name
              <span className="text-destructive">*</span>
            </label>

            <Input
              placeholder="e.g. Napa Extra"
              {...register("name", {
                required: "Medicine name is required",
              })}
              className="h-10 rounded-xl text-sm"
            />

            {errors.name && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-semibold text-foreground">
              Category
              <span className="text-destructive">*</span>
            </label>

            <Controller
              name="category"
              control={control}
              rules={{
                required: "Category is required",
              }}
              render={({ field }) => (
                <Select
                  disabled={isFetchingCategories}
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="h-10 w-full rounded-xl text-sm">
                    <SelectValue
                      placeholder={
                        isFetchingCategories
                          ? "Loading categories..."
                          : "Select category"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent className="rounded-xl">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.category && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-semibold text-foreground">
                Price (৳)
                <span className="text-destructive">*</span>
              </label>

              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Price cannot be negative",
                  },
                })}
                className="h-10 rounded-xl text-sm"
              />

              {errors.price && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-semibold text-foreground">
                Stock Units
                <span className="text-destructive">*</span>
              </label>

              <Input
                type="number"
                placeholder="0"
                {...register("stock", {
                  required: "Stock is required",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Stock cannot be negative",
                  },
                })}
                className="h-10 rounded-xl text-sm"
              />

              {errors.stock && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-semibold text-foreground">
              Manufacturer
              <span className="text-destructive">*</span>
            </label>

            <Input
              placeholder="e.g. Beximco Pharmaceuticals"
              {...register("manufacturer", {
                required: "Manufacturer is required",
              })}
              className="h-10 rounded-xl text-sm"
            />

            {errors.manufacturer && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.manufacturer.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-semibold text-foreground">
              Medicine Image
              <span className="text-destructive">*</span>
            </label>

            {imagePreview ? (
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-2.5">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-border/40 bg-background">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <p className="max-w-[200px] truncate text-xs font-medium text-foreground">
                      {imageFile ? imageFile.name : "Current Image"}
                    </p>

                    <p className="text-[10px] text-muted-foreground">
                      Ready to save
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveImage}
                  className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/10 p-4 transition-colors hover:border-primary/50">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Upload className="h-4 w-4" />
                </div>

                <p className="text-xs font-medium text-foreground">
                  Click to upload image
                </p>

                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  PNG, JPG, WEBP up to 5MB
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-semibold text-foreground">
              Description
              <span className="text-destructive">*</span>
            </label>

            <Textarea
              placeholder="Enter medicine description, usage, side effects..."
              {...register("description", {
                required: "Description is required",
              })}
              className="h-20 resize-none rounded-xl text-sm"
            />

            {errors.description && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 rounded-xl px-4 text-xs"
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="h-10 gap-2 rounded-xl px-4 text-xs shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}

              {mode === "add" ? "Add Medicine" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
