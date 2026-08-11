// src/components/pages/dashboard/recent-orders-table.tsx
import { OrderRow } from "@/types/dashboard";

interface RecentOrdersTableProps {
  title: string;
  description: string;
  primaryColumnHeader: string;
  secondaryColumnHeader: string;
  orders: OrderRow[];
}

export function RecentOrdersTable({
  title,
  description,
  primaryColumnHeader,
  secondaryColumnHeader,
  orders,
}: RecentOrdersTableProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-emerald-500/10 text-emerald-500";
      case "processing":
      case "on the way":
      case "confirmed":
      case "shipped":
        return "bg-blue-500/10 text-blue-500";
      case "cancelled":
        return "bg-rose-500/10 text-rose-500";
      default:
        return "bg-amber-500/10 text-amber-500";
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border/60">
        <h4 className="text-base font-bold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="py-3 px-6">Order ID</th>
              <th className="py-3 px-6">{primaryColumnHeader}</th>
              <th className="py-3 px-6">{secondaryColumnHeader}</th>
              <th className="py-3 px-6">Amount</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-sm">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-4 px-6 font-semibold text-foreground">
                  {order.id}
                </td>
                <td className="py-4 px-6 text-muted-foreground">
                  {order.primaryIdentifier}
                </td>
                <td className="py-4 px-6 text-muted-foreground">
                  {order.secondaryDetail}
                </td>
                <td className="py-4 px-6 font-medium text-foreground">
                  ৳ {order.amount}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-xs text-muted-foreground">
                  {order.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}