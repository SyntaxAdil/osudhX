import type { Product } from "../../generated/prisma/client";
import {prisma} from "../../lib/prisma";
import ApiError from "../../lib/ApiError";
import { resolvePagination, buildPaginationMeta, type PaginationMeta } from "../../lib/pagination";
import type { CreateProductData, ProductQuery, UpdateProductData } from "../../types/product.types";

/**
 * Creates a new product owned by the given seller.
 */
const createProduct = async (sellerId: string, data: CreateProductData): Promise<Product> => {
  const category = await prisma.category.findFirst({
    where: { id: data.categoryId, isDeleted: false },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return prisma.product.create({
    data: {
      ...data,
      sellerId,
      status: data.stock > 0 ? "available" : "stockout",
    },
  });
};

/**
 * Returns a paginated, filterable, searchable list of non-deleted products.
 */
const getAllProducts = async (
  query: ProductQuery,
): Promise<{ products: Product[]; meta: PaginationMeta }> => {
  const { page, limit, skip, take } = resolvePagination(query.page, query.limit);

  const where = {
    isDeleted: false,
    ...(query.categoryId ? { categoryId: query.categoryId } : {}),
    ...(query.status ? { status: query.status } : {}),
    ...(query.search
      ? { name: { contains: query.search, mode: "insensitive" as const } }
      : {}),
  };

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { [query.sortBy ?? "createdAt"]: query.sortOrder ?? "desc" },
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, meta: buildPaginationMeta(page, limit, total) };
};

/**
 * Fetches a single product by id. Throws 404 if missing or soft-deleted.
 */
const getProductById = async (id: string): Promise<Product> => {
  const product = await prisma.product.findFirst({
    where: { id, isDeleted: false },
    include: { category: true },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

/**
 * Ensures the given product exists, is not deleted, and belongs to the seller.
 */
const assertOwnership = async (id: string, sellerId: string): Promise<Product> => {
  const product = await prisma.product.findFirst({
    where: { id, isDeleted: false },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.sellerId !== sellerId) {
    throw new ApiError(403, "Forbidden - You do not own this product");
  }

  return product;
};

/**
 * Updates a product. Only the owning seller may perform this action.
 */
const updateProduct = async (
  id: string,
  sellerId: string,
  data: UpdateProductData,
): Promise<Product> => {
  await assertOwnership(id, sellerId);

  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, isDeleted: false },
    });

    if (!category) {
      throw new ApiError(404, "Category not found");
    }
  }

  return prisma.product.update({
    where: { id },
    data,
  });
};

/**
 * Soft-deletes a product. Only the owning seller may perform this action.
 */
const deleteProduct = async (id: string, sellerId: string): Promise<Product> => {
  await assertOwnership(id, sellerId);

  return prisma.product.update({
    where: { id },
    data: { isDeleted: true },
  });
};

const productService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

export default productService;
