import { OrderDetails } from "@/components/pages/dashboard/orders/order-details";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <main className="space-y-6">
      <OrderDetails id={id} />
    </main>
  );
}