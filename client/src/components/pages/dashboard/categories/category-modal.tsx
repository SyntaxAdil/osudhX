import * as React from "react";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { CategoryFormData, CategoryRow } from "../../../../types/category";


interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  mode: "add" | "edit";
  activeCategory: CategoryRow | null;
  imagePreview: string;
  imageFile: File | null;
  isSubmitting: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  activeCategory,
  imagePreview,
  imageFile,
  isSubmitting,
  onImageChange,
  onRemoveImage,
}: CategoryModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const prevIsOpenRef = React.useRef(isOpen);
  React.useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      if (mode === "edit" && activeCategory) {
        reset({
          name: activeCategory.name || "",
          description: activeCategory.description || "",
        });
      } else {
        reset({
          name: "",
          description: "",
        });
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, mode, activeCategory, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg rounded-2xl p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-bold">
            {mode === "add" ? "Add New Category" : "Edit Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              Category Name <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g. Antibiotics"
              {...register("name", { required: "Category name is required" })}
              className="rounded-xl h-10 text-sm"
            />
            {errors.name && (
              <p className="text-[11px] text-destructive font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              Category Image <span className="text-destructive">*</span>
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
                  onClick={onRemoveImage}
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
                <p className="text-xs font-medium text-foreground">Click to upload category image</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG, WEBP up to 5MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Description</label>
            <Textarea
              placeholder="Enter category description..."
              {...register("description")}
              className="rounded-xl resize-none h-20 text-sm"
            />
          </div>

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
              {mode === "add" ? "Add Category" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}