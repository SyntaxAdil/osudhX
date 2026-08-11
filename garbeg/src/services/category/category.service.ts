import type { Category } from "../../generated/prisma/client";
import prisma from "../../lib/prisma";
import ApiError from "../../lib/ApiError";
import { resolvePagination, buildPaginationMeta, type PaginationMeta } from "../../lib/pagination";
import type { CategoryQuery, CreateCategoryData, UpdateCategoryData } from "../../types/category.types";

/**
 * Creates a new category.
 */
const createCategory = async (data: CreateCategoryData): Promise<Category> => {
  const existing = await prisma.category.findFirst({
    where: { name: data.name, isDeleted: false },
  });

  if (existing) {
    throw new ApiError(409, "A category with this name already exists");
  }

  return prisma.category.create({ data });
};

/**
 * Returns a paginated, searchable list of non-deleted categories.
 */
const getAllCategories = async (
  query: CategoryQuery,
): Promise<{ categories: Category[]; meta: PaginationMeta }> => {
  const { page, limit, skip, take } = resolvePagination(query.page, query.limit);

  const where = {
    isDeleted: false,
    ...(query.search
      ? { name: { contains: query.search, mode: "insensitive" as const } }
      : {}),
  };

  const [categories, total] = await prisma.$transaction([
    prisma.category.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: query.sortOrder ?? "desc" },
    }),
    prisma.category.count({ where }),
  ]);

  return { categories, meta: buildPaginationMeta(page, limit, total) };
};

/**
 * Fetches a single category by id. Throws 404 if missing or soft-deleted.
 */
const getCategoryById = async (id: string): Promise<Category> => {
  const category = await prisma.category.findFirst({
    where: { id, isDeleted: false },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

/**
 * Updates an existing category.
 */
const updateCategory = async (id: string, data: UpdateCategoryData): Promise<Category> => {
  await getCategoryById(id);

  return prisma.category.update({
    where: { id },
    data,
  });
};

/**
 * Soft-deletes a category by flipping `isDeleted` to true.
 */
const deleteCategory = async (id: string): Promise<Category> => {
  await getCategoryById(id);

  return prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });
};

const categoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

export default categoryService;
