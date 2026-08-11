import { OrderItems } from "./order-item";

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  shippingAddress: string;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
  status: string;
  orderItems: OrderItems[];
}
