import { apiFetch } from "@/lib/api";

import type {
  Category,
  CategoryApiResponse,
  CategoryQueryParams,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category";

const buildQueryString = (params?: CategoryQueryParams) => {
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

export const categoryService = {
  getCategories: async (
    params?: CategoryQueryParams,
  ): Promise<CategoryApiResponse<Category[]>> => {
    const queryString = buildQueryString(params);

    return apiFetch<CategoryApiResponse<Category[]>>(
      `/api/categories${queryString}`,
    );
  },

  getCategoryById: async (
    id: string,
  ): Promise<CategoryApiResponse<Category>> => {
    return apiFetch<CategoryApiResponse<Category>>(
      `/api/categories/${id}`,
    );
  },

  createCategory: async (
    data: CreateCategoryRequest,
  ): Promise<CategoryApiResponse<Category>> => {
    return apiFetch<CategoryApiResponse<Category>>(
      "/api/categories",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  updateCategory: async (
    id: string,
    data: UpdateCategoryRequest,
  ): Promise<CategoryApiResponse<Category>> => {
    return apiFetch<CategoryApiResponse<Category>>(
      `/api/categories/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
  },

  deleteCategory: async (
    id: string,
  ): Promise<CategoryApiResponse<Category>> => {
    return apiFetch<CategoryApiResponse<Category>>(
      `/api/categories/${id}`,
      {
        method: "DELETE",
      },
    );
  },
};