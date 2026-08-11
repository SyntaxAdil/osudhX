import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../lib/sendResponse";
import categoryService from "../services/category/category.service";
import type { CategoryQuery, CreateCategoryData, UpdateCategoryData } from "../types/category.types";

/**
 * POST /api/categories
 * Access: seller
 */
const createCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const payload = req.body as CreateCategoryData;

  const category = await categoryService.createCategory(payload);

  sendResponse(res, {
    statusCode: 201,
    message: "Category created successfully",
    data: category,
  });
});

/**
 * GET /api/categories
 * Access: public
 */
const getAllCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const query: CategoryQuery = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    search: req.query.search as string | undefined,
    sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
  };

  const { categories, meta } = await categoryService.getAllCategories(query);

  sendResponse(res, {
    message: "Categories retrieved successfully",
    data: categories,
    meta,
  });
});

/**
 * GET /api/categories/:id
 * Access: public
 */
const getCategoryById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const category = await categoryService.getCategoryById(id as string);

  sendResponse(res, {
    message: "Category retrieved successfully",
    data: category,
  });
});

/**
 * PATCH /api/categories/:id
 * Access: seller
 */
const updateCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const payload = req.body as UpdateCategoryData;

  const category = await categoryService.updateCategory(id as string, payload);

  sendResponse(res, {
    message: "Category updated successfully",
    data: category,
  });
});

/**
 * DELETE /api/categories/:id
 * Access: seller
 */
const deleteCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  await categoryService.deleteCategory(id as string);

  sendResponse(res, {
    message: "Category deleted successfully",
  });
});

const categoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

export default categoryController;
