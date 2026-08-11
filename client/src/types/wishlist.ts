export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    stock: number;
    status: "available" | "sold" | "stockout";
  };
}

export interface CreateWishlistRequest {
  productId: string;
}

export interface WishlistQueryParams {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface WishlistApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}