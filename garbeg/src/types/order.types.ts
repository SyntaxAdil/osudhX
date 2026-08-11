import type { ORDER_STATUS } from "../generated/prisma/enums";

export interface OrderQuery {
  page?: number;
  limit?: number;
  status?: ORDER_STATUS;
  userId?: string;
  sortOrder?: "asc" | "desc";
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderData {
  shippingAddress: string;
  phone: string;
  items: OrderItemInput[];
}

export interface UpdateOrderStatusData {
  status: ORDER_STATUS;
}
