import OrderDetails from "../../../../../components/pages/dashboard/my-orders/order-details";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  return <OrderDetails id={id} />;
}