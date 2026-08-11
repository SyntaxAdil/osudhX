export interface CategoryQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  image?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  image?: string;
}
