import { apiFetch } from "@/lib/api";

import type {
  CreateOrderRequest,
  Order,
  OrderApiResponse,
  OrderQueryParams,
  UpdateOrderStatusRequest,
} from "@/types/order";

const buildQueryString = (params?: OrderQueryParams) => {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
};

export const orderService = {
  createOrder: async (
    data: CreateOrderRequest,
  ): Promise<OrderApiResponse<Order>> => {
    return apiFetch<OrderApiResponse<Order>>(
      "/api/orders",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  getOrders: async (
    params?: OrderQueryParams,
  ): Promise<OrderApiResponse<Order[]>> => {
    const queryString = buildQueryString(params);

    return apiFetch<OrderApiResponse<Order[]>>(
      `/api/orders${queryString}`,
    );
  },

  getOrderById: async (
    id: string,
  ): Promise<OrderApiResponse<Order>> => {
    return apiFetch<OrderApiResponse<Order>>(
      `/api/orders/${id}`,
    );
  },

  updateOrderStatus: async (
    id: string,
    data: UpdateOrderStatusRequest,
  ): Promise<OrderApiResponse<Order>> => {
    return apiFetch<OrderApiResponse<Order>>(
      `/api/orders/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
  },

  cancelOrder: async (
    id: string,
  ): Promise<OrderApiResponse<Order>> => {
    return apiFetch<OrderApiResponse<Order>>(
      `/api/orders/${id}/cancel`,
      {
        method: "PATCH",
      },
    );
  },
};