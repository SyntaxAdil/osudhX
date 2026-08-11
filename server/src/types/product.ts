export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: "available" | "sold" | "stockout";
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
  status?: "available" | "sold" | "stockout";
}