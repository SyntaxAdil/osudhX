"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { productService } from "@/services/product.service";

import type {
  CreateProductRequest,
  ProductQueryParams,
  UpdateProductRequest,
} from "@/types/product";

export const productKeys = {
  all: ["products"] as const,

  lists: () => [...productKeys.all, "list"] as const,

  list: (params?: ProductQueryParams) =>
    [...productKeys.lists(), params] as const,

  details: () => [...productKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...productKeys.details(), id] as const,
};

export const useProducts = (
  params?: ProductQueryParams,
) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getProducts(params),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: Boolean(id),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) =>
      productService.createProduct(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProductRequest;
    }) =>
      productService.updateProduct(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      productService.deleteProduct(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });

      queryClient.removeQueries({
        queryKey: productKeys.detail(id),
      });
    },
  });
};