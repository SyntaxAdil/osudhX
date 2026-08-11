import type { PRODUCT_STATUS_ENUM } from "../generated/prisma/enums";

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: PRODUCT_STATUS_ENUM;
  sortBy?: "createdAt" | "price" | "name";
  sortOrder?: "asc" | "desc";
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  manufacturer: string;
  categoryId: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  image?: string;
  manufacturer?: string;
  categoryId?: string;
  status?: PRODUCT_STATUS_ENUM;
}
