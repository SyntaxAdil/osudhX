"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { Order } from "@/types/order";
import { dataTableFeatures } from "../../../shared/data-table";

interface GetOrderColumnsProps {
  onView: (order: Order) => void;
}

const statusConfig: Record<
  Order["status"],
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  confirmed: {
    label: "Confirmed",
    className:
      "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  shipped: {
    label: "Shipped",
    className:
      "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  delivered: {
    label: "Delivered",
    className:
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export const getOrderColumns = ({
  onView,
}: GetOrderColumnsProps): ColumnDef<
  typeof dataTableFeatures,
  Order
>[] => [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => {
      const id = row.getValue<string>("id");

      return (
        <span className="font-medium text-foreground">
          #{id.slice(0, 8)}
        </span>
      );
    },
  },

  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue<number>("totalAmount");

      return (
        <span className="font-semibold text-foreground">
          ৳ {amount.toFixed(2)}
        </span>
      );
    },
  },

  {
    id: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.original.orderItems ?? [];

      return (
        <span className="text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      );
    },
  },

  {
    accessorKey: "shippingAddress",
    header: "Shipping Address",
    cell: ({ row }) => {
      const address = row.getValue<string>("shippingAddress");

      return (
        <span
          className="block max-w-[220px] truncate text-muted-foreground"
          title={address}
        >
          {address}
        </span>
      );
    },
  },

  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue<string>("phone")}
      </span>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<Order["status"]>("status");
      const config = statusConfig[status];

      return (
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${config.className}`}
        >
          {config.label}
        </span>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue<string>("createdAt");

      return (
        <span className="text-muted-foreground">
          {new Date(date).toLocaleDateString()}
        </span>
      );
    },
  },

  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onView(order)}
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          title="View Order"
        >
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },
];