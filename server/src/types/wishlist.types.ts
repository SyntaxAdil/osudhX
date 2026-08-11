export interface WishlistQuery {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}

export interface CreateWishlistData {
  productId: string;
}