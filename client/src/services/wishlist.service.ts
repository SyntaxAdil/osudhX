import { apiFetch } from "@/lib/api";

import type {
  CreateWishlistRequest,
  Wishlist,
  WishlistApiResponse,
  WishlistQueryParams,
} from "@/types/wishlist";

const buildQueryString = (params?: WishlistQueryParams) => {
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

export const wishlistService = {
  addToWishlist: async (
    data: CreateWishlistRequest,
  ): Promise<WishlistApiResponse<Wishlist>> => {
    return apiFetch<WishlistApiResponse<Wishlist>>(
      "/api/wishlist",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true,
    );
  },

  getWishlist: async (
    params?: WishlistQueryParams,
  ): Promise<WishlistApiResponse<Wishlist[]>> => {
    const queryString = buildQueryString(params);

    return apiFetch<WishlistApiResponse<Wishlist[]>>(
      `/api/wishlist${queryString}`,
      {},
      true,
    );
  },

  getWishlistById: async (
    id: string,
  ): Promise<WishlistApiResponse<Wishlist>> => {
    return apiFetch<WishlistApiResponse<Wishlist>>(
      `/api/wishlist/${id}`,
      {},
      true,
    );
  },

  removeFromWishlist: async (
    id: string,
  ): Promise<WishlistApiResponse<Wishlist>> => {
    return apiFetch<WishlistApiResponse<Wishlist>>(
      `/api/wishlist/${id}`,
      {
        method: "DELETE",
      },
      true,
    );
  },
};