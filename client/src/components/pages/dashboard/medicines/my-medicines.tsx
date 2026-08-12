// src/components/pages/dashboard/medicines/my-medicines.tsx
"use client";

import * as React from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "../../../shared/data-table";
import { getMedicineColumns, MedicineRow } from "./medicine.column";
import { MedicineModal } from "./medicine-modal";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProductResponse {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: {
    id: string;
    name: string;
  } | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export default function MyMedicines() {
  const [medicines, setMedicines] = React.useState<MedicineRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");
  const [activeMedicine, setActiveMedicine] =
    React.useState<MedicineRow | null>(null);

  const fetchMedicines = React.useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await fetch(`${API_URL}/api/products`, {
        credentials: "include",
      });

      const result: ApiResponse<ProductResponse[]> = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch medicines");
      }

      const products = Array.isArray(result.data) ? result.data : [];

      const mappedMedicines: MedicineRow[] = products.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category?.name ?? "Uncategorized",
        price: product.price,
        stock: product.stock,
      }));

      setMedicines(mappedMedicines);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while fetching medicines",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/api/products`, {
          credentials: "include",
        });

        const result: ApiResponse<ProductResponse[]> = await res.json();

        if (!res.ok) {
          throw new Error(result.message || "Failed to fetch medicines");
        }

        if (isMounted) {
          const products = Array.isArray(result.data) ? result.data : [];
          const mappedMedicines: MedicineRow[] = products.map((product) => ({
            id: product.id,
            name: product.name,
            category: product.category?.name ?? "Uncategorized",
            price: product.price,
            stock: product.stock,
          }));
          setMedicines(mappedMedicines);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            error instanceof Error
              ? error.message
              : "An error occurred while fetching medicines"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setActiveMedicine(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (medicine: MedicineRow) => {
    setModalMode("edit");
    setActiveMedicine(medicine);
    setIsModalOpen(true);
  };

  const handleDeleteMedicine = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result: ApiResponse<null> = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to delete medicine");
        return;
      }

      setMedicines((prev) => prev.filter((item) => item.id !== id));

      toast.success("Medicine deleted successfully");
    } catch {
      toast.error("An error occurred while deleting the medicine");
    }
  };

  const handleFormSubmit = async (
    data: Omit<MedicineRow, "id">,
  ) => {
    try {
      if (modalMode === "add") {
        const res = await fetch(`${API_URL}/api/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: data.name,
            price: data.price,
            stock: data.stock,
            categoryId: data.category,
          }),
        });

        const result: ApiResponse<ProductResponse> = await res.json();

        if (!res.ok) {
          toast.error(result.message || "Failed to add medicine");
          return;
        }

        const newMedicine: MedicineRow = {
          id: result.data.id,
          name: result.data.name,
          category: result.data.category?.name ?? "Uncategorized",
          price: result.data.price,
          stock: result.data.stock,
        };

        setMedicines((prev) => [newMedicine, ...prev]);

        toast.success("Medicine added successfully");
        setIsModalOpen(false);
        return;
      }

      if (modalMode === "edit" && activeMedicine) {
        const res = await fetch(
          `${API_URL}/api/products/${activeMedicine.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              name: data.name,
              price: data.price,
              stock: data.stock,
              categoryId: data.category,
            }),
          },
        );

        const result: ApiResponse<ProductResponse> = await res.json();

        if (!res.ok) {
          toast.error(result.message || "Failed to update medicine");
          return;
        }

        const updatedMedicine: MedicineRow = {
          id: result.data.id,
          name: result.data.name,
          category: result.data.category?.name ?? "Uncategorized",
          price: result.data.price,
          stock: result.data.stock,
        };

        setMedicines((prev) =>
          prev.map((item) =>
            item.id === activeMedicine.id ? updatedMedicine : item,
          ),
        );

        toast.success("Medicine updated successfully");
        setIsModalOpen(false);
      }
    } catch {
      toast.error("An error occurred while saving the medicine");
    }
  };

  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(medicines.map((medicine) => medicine.category)),
    );

    return ["All", ...uniqueCategories];
  }, [medicines]);

  const filteredMedicines = React.useMemo(() => {
    return medicines.filter((medicine) => {
      const matchesSearch = medicine.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        medicine.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [medicines, searchQuery, selectedCategory]);

  const columns = React.useMemo(
    () =>
      getMedicineColumns({
        onEdit: handleOpenEditModal,
        onDelete: handleDeleteMedicine,
      }),
    [handleOpenEditModal, handleDeleteMedicine],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Medicines Management
          </h2>

          <p className="text-xs text-muted-foreground">
            Manage your pharmacy inventory, prices, and stock levels.
          </p>
        </div>

        <Button
          onClick={handleOpenAddModal}
          className="gap-2 rounded-xl shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Medicine
        </Button>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:flex-row">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="rounded-xl pl-9"
          />
        </div>

        <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
          {categories.map((category) => (
            <Button
              key={category}
              variant={
                selectedCategory === category ? "default" : "outline"
              }
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap rounded-xl text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-border/60 bg-card">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredMedicines}
        />
      )}

      <MedicineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={activeMedicine}
        mode={modalMode}
      />
    </div>
  );
}