import type { ORDER_STATUS } from "../generated/prisma/enums";


export interface OrderQuery {
  page?: number;
  limit?: number;
  status?: ORDER_STATUS;
  userId?: string;
  sortOrder?: "asc" | "desc";
}