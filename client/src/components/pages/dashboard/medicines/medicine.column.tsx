"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { dataTableFeatures } from "../../../shared/data-table";

export interface MedicineRow {
  id: string;
  name: string;
  category: string;
  categoryId?: string;
  price: number;
  stock: number;
  description?: string;
  manufacturer?: string;
  image?: string;
}

interface GetColumnsProps {
  onEdit: (medicine: MedicineRow) => void;
  onDelete: (id: string) => void;
}

export const getMedicineColumns = ({
  onEdit,
  onDelete,
}: GetColumnsProps): ColumnDef<typeof dataTableFeatures, MedicineRow>[] => [
  {
    accessorKey: "name",
    header: "Medicine Name",
    cell: ({ row }) => (
      <span className="font-semibold text-foreground">
        {row.getValue<string>("name")}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue<string>("category")}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const amount = row.getValue<number>("price");

      return (
        <span className="font-medium text-foreground">
          ৳ {amount.toFixed(2)}
        </span>
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue<number>("stock");

      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
            stock <= 10
              ? "bg-destructive/10 text-destructive"
              : "bg-emerald-500/10 text-emerald-500"
          }`}
        >
          {stock} units
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const medicine = row.original;

      return (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/medicines/${medicine.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(medicine)}
            className="h-8 w-8 text-muted-foreground hover:text-amber-500"
            title="Edit Medicine"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(medicine.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            title="Delete Medicine"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
