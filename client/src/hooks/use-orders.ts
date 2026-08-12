"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { orderService } from "@/services/order.service";

import type {
  CreateOrderRequest,
  OrderQueryParams,
  UpdateOrderStatusRequest,
} from "@/types/order";

export const orderKeys = {
  all: ["orders"] as const,

  lists: () => [...orderKeys.all, "list"] as const,

  list: (params?: OrderQueryParams) =>
    [...orderKeys.lists(), params] as const,

  details: () => [...orderKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...orderKeys.details(), id] as const,
};

export const useOrders = (
  params?: OrderQueryParams,
) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => orderService.getOrders(params),
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getOrderById(id),
    enabled: Boolean(id),
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) =>
      orderService.createOrder(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists(),
      });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateOrderStatusRequest;
    }) =>
      orderService.updateOrderStatus(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.id),
      });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      orderService.cancelOrder(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(id),
      });
    },
  });
};