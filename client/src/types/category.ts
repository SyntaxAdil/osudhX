export interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  image?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  image?: string;
}

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CategoryApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface CategoryRow {
  id: string;
  name: string;
  description?: string;
  image?: string;
  productsCount?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CategoryFormData {
  name: string;
  description: string;
}