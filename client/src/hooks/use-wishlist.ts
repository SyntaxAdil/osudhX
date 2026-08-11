"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { wishlistService } from "@/services/wishlist.service";

import type {
  CreateWishlistRequest,
  WishlistQueryParams,
} from "@/types/wishlist";

export const wishlistKeys = {
  all: ["wishlist"] as const,

  lists: () => [...wishlistKeys.all, "list"] as const,

  list: (params?: WishlistQueryParams) =>
    [...wishlistKeys.lists(), params] as const,

  details: () => [...wishlistKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...wishlistKeys.details(), id] as const,
};

export const useWishlist = (
  params?: WishlistQueryParams,
) => {
  return useQuery({
    queryKey: wishlistKeys.list(params),
    queryFn: () => wishlistService.getWishlist(params),
  });
};

export const useWishlistById = (id: string) => {
  return useQuery({
    queryKey: wishlistKeys.detail(id),
    queryFn: () => wishlistService.getWishlistById(id),
    enabled: Boolean(id),
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWishlistRequest) =>
      wishlistService.addToWishlist(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wishlistKeys.lists(),
      });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      wishlistService.removeFromWishlist(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: wishlistKeys.lists(),
      });

      queryClient.removeQueries({
        queryKey: wishlistKeys.detail(id),
      });
    },
  });
};