/**
 * Normalizes raw page/limit query params into safe, bounded values
 * and returns the corresponding Prisma `skip`/`take` pair.
 */
export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export const resolvePagination = (page?: number, limit?: number): PaginationResult => {
  const safePage = page && page > 0 ? Math.floor(page) : DEFAULT_PAGE;
  const rawLimit = limit && limit > 0 ? Math.floor(limit) : DEFAULT_LIMIT;
  const safeLimit = Math.min(rawLimit, MAX_LIMIT);

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  };
};

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const buildPaginationMeta = (
  page: number,
  limit: number,
  total: number,
): PaginationMeta => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 1,
});
