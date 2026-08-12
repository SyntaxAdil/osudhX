import { apiFetch } from "@/lib/api";

import type {
  ApiResponse,
  CreateProductRequest,
  Product,
  ProductQueryParams,
  UpdateProductRequest,
} from "@/types/product";

const buildQueryString = (params?: ProductQueryParams) => {
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

export const productService = {
  getProducts: async (
    params?: ProductQueryParams,
  ): Promise<ApiResponse<Product[]>> => {
    const queryString = buildQueryString(params);

    return apiFetch<ApiResponse<Product[]>>(
      `/api/products${queryString}`,
    );
  },

  getProductById: async (
    id: string,
  ): Promise<ApiResponse<Product>> => {
    return apiFetch<ApiResponse<Product>>(
      `/api/products/${id}`,
    );
  },

  createProduct: async (
    data: CreateProductRequest,
  ): Promise<ApiResponse<Product>> => {
    return apiFetch<ApiResponse<Product>>(
      "/api/products",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true,
    );
  },

  updateProduct: async (
    id: string,
    data: UpdateProductRequest,
  ): Promise<ApiResponse<Product>> => {
    return apiFetch<ApiResponse<Product>>(
      `/api/products/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      true,
    );
  },

  deleteProduct: async (
    id: string,
  ): Promise<ApiResponse<Product>> => {
    return apiFetch<ApiResponse<Product>>(
      `/api/products/${id}`,
      {
        method: "DELETE",
      },
      true,
    );
  },
};