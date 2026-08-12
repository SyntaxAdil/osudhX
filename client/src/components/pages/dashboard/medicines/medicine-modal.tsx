// src/components/pages/dashboard/medicines/medicine-modal.tsx
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
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  const [imagePreview, setImagePreview] = React.useState<string>("");

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

  // Fetch categories when modal opens
  React.useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          setIsFetchingCategories(true);
          const res = await fetch(`${API_URL}/api/categories`, {
            credentials: "include",
          });
          const result: ApiCategoryResponse = await res.json();
          if (res.ok && result.success) {
            setCategories(result.data);
          }
        } catch {
          // Fallback handled silently
        } finally {
          setIsFetchingCategories(false);
        }
      };

      fetchCategories();
    }
  }, [isOpen]);

  // Track previous modal open state using standard derived state / props comparison during render (React recommended pattern)
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      if (mode === "edit" && initialData) {
        reset({
          name: initialData.name || "",
          description: initialData.description || "",
          price: initialData.price || 0,
          stock: initialData.stock || 0,
          manufacturer: initialData.manufacturer || "",
          category: initialData.categoryId || "",
        });
        setImagePreview(initialData.image || "");
        setImageFile(null);
      } else {
        reset({
          name: "",
          description: "",
          price: 0,
          stock: 0,
          manufacturer: "",
          category: "",
        });
        setImagePreview("");
        setImageFile(null);
      }
    }
  }

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

  const handleFormSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      let finalImageUrl = imagePreview;

      if (imageFile) {
        toast.loading("Uploading image to ImgBB...", { id: "img-upload" });
        try {
          finalImageUrl = await uploadImageToImgBB(imageFile);
          toast.success("Image uploaded successfully", { id: "img-upload" });
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Image upload failed", { id: "img-upload" });
          setIsSubmitting(false);
          return;
        }
      }

      if (!finalImageUrl) {
        toast.error("Medicine image is required");
        setIsSubmitting(false);
        return;
      }

      await onSubmit({
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        image: finalImageUrl,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg rounded-2xl p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-bold">
            {mode === "add" ? "Add New Medicine" : "Edit Medicine"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Medicine Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              Medicine Name <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g. Napa Extra"
              {...register("name", { required: "Medicine name is required" })}
              className="rounded-xl h-10 text-sm"
            />
            {errors.name && (
              <p className="text-[11px] text-destructive font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              Category <span className="text-destructive">*</span>
            </label>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Select
                  disabled={isFetchingCategories}
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="rounded-xl h-10 w-full text-sm">
                    <SelectValue placeholder={isFetchingCategories ? "Loading categories..." : "Select category"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-[11px] text-destructive font-medium">{errors.category.message}</p>
            )}
          </div>

          {/* Price & Stock Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                Price (৳) <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("price", { required: "Price is required", valueAsNumber: true })}
                className="rounded-xl h-10 text-sm"
              />
              {errors.price && (
                <p className="text-[11px] text-destructive font-medium">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                Stock Units <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                placeholder="0"
                {...register("stock", { required: "Stock is required", valueAsNumber: true })}
                className="rounded-xl h-10 text-sm"
              />
              {errors.stock && (
                <p className="text-[11px] text-destructive font-medium">{errors.stock.message}</p>
              )}
            </div>
          </div>

          {/* Manufacturer */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              Manufacturer <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g. Beximco Pharmaceuticals"
              {...register("manufacturer", { required: "Manufacturer is required" })}
              className="rounded-xl h-10 text-sm"
            />
            {errors.manufacturer && (
              <p className="text-[11px] text-destructive font-medium">{errors.manufacturer.message}</p>
            )}
          </div>

          {/* Professional Image Upload & Preview Section */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              Medicine Image <span className="text-destructive">*</span>
            </label>

            {imagePreview ? (
              <div className="relative flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-lg overflow-hidden border border-border/40 relative bg-background flex-shrink-0">
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-foreground truncate max-w-[200px]">
                      {imageFile ? imageFile.name : "Current Image"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Ready to save</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveImage}
                  className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 hover:border-primary/50 rounded-xl p-4 cursor-pointer bg-muted/10 transition-colors">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2 text-muted-foreground">
                  <Upload className="h-4 w-4" />
                </div>
                <p className="text-xs font-medium text-foreground">Click to upload image</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG, WEBP up to 5MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              Description <span className="text-destructive">*</span>
            </label>
            <Textarea
              placeholder="Enter medicine description, usage, side effects..."
              {...register("description", { required: "Description is required" })}
              className="rounded-xl resize-none h-20 text-sm"
            />
            {errors.description && (
              <p className="text-[11px] text-destructive font-medium">{errors.description.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl h-10 text-xs px-4"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl gap-2 h-10 text-xs px-4 shadow-sm" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "add" ? "Add Medicine" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}