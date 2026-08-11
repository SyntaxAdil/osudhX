import type { Wishlist } from "../../generated/prisma/client";
import ApiError from "../../lib/ApiError";
import {
  resolvePagination,
  buildPaginationMeta,
  type PaginationMeta,
} from "../../lib/pagination";
import { prisma } from "../../lib/prisma";
import type { WishlistQuery } from "../../types/wishlist.types";

const addToWishlist = async (
  userId: string,
  productId: string,
): Promise<Wishlist> => {
  const product = await prisma.product.findFirst({
    where: { id: productId, isDeleted: false },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    throw new ApiError(409, "Product is already in your wishlist");
  }

  return prisma.wishlist.create({
    data: { userId, productId },
  });
};

const getWishlist = async (
  userId: string,
  query: WishlistQuery,
): Promise<{ wishlist: Wishlist[]; meta: PaginationMeta }> => {
  const { page, limit, skip, take } = resolvePagination(
    query.page,
    query.limit,
  );

  const where = { userId };

  const [wishlist, total] = await prisma.$transaction([
    prisma.wishlist.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: query.sortOrder ?? "desc" },
      include: { product: true },
    }),
    prisma.wishlist.count({ where }),
  ]);

  return { wishlist, meta: buildPaginationMeta(page, limit, total) };
};

const getWishlistById = async (
  id: string,
  userId: string,
): Promise<Wishlist> => {
  const entry = await prisma.wishlist.findFirst({
    where: { id, userId },
    include: { product: true },
  });

  if (!entry) {
    throw new ApiError(404, "Wishlist entry not found");
  }

  return entry;
};

const removeFromWishlist = async (
  id: string,
  userId: string,
): Promise<Wishlist> => {
  await getWishlistById(id, userId);

  return prisma.wishlist.delete({
    where: { id },
  });
};

const wishlistService = {
  addToWishlist,
  getWishlist,
  getWishlistById,
  removeFromWishlist,
};

export default wishlistService;
