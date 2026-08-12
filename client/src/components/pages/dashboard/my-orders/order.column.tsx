"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { dataTableFeatures } from "../../../shared/data-table";
import type { Order, OrderStatus } from "@/types/order";

interface GetOrderColumnsProps {
  onView: (order: Order) => void;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  shipped: {
    label: "Shipped",
    className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export const getOrderColumns = ({
  onView,
}: GetOrderColumnsProps): ColumnDef<typeof dataTableFeatures, Order>[] => [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => {
      const id = row.getValue<string>("id");

      return (
        <span className="font-medium text-foreground">#{id.slice(0, 8)}</span>
      );
    },
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <span className="text-muted-foreground">
          {order.orderItems?.length ?? 0} items
        </span>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      const amount = row.getValue<number>("totalAmount");

      return (
        <span className="font-semibold text-foreground">
          ৳ {Number(amount).toFixed(2)}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<OrderStatus>("status");
      const config = statusConfig[status];

      return (
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${config.className}`}
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
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(order)}
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            title="View Order"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Link href={`/dashboard/my-orders/${order.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-lg text-xs"
            >
              Details
            </Button>
          </Link>
        </div>
      );
    },
  },
];
