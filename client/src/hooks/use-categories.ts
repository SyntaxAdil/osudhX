"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { categoryService } from "@/services/category.service";

import type {
  CategoryQueryParams,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category";

export const categoryKeys = {
  all: ["categories"] as const,

  lists: () => [...categoryKeys.all, "list"] as const,

  list: (params?: CategoryQueryParams) =>
    [...categoryKeys.lists(), params] as const,

  details: () => [...categoryKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...categoryKeys.details(), id] as const,
};

export const useCategories = (
  params?: CategoryQueryParams,
) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryService.getCategories(params),
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategoryById(id),
    enabled: Boolean(id),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      categoryService.createCategory(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCategoryRequest;
    }) => categoryService.updateCategory(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      categoryService.deleteCategory(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
      });

      queryClient.removeQueries({
        queryKey: categoryKeys.detail(id),
      });
    },
  });
};