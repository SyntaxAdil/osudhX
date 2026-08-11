import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { categoryService } from "../services/category.services";

const getCategories = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const query = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,

      search:
        typeof req.query.search === "string"
          ? req.query.search
          : undefined,

      sortOrder:
        req.query.sortOrder === "asc"
          ? ("asc" as const)
          : ("desc" as const),
    };

    const result = await categoryService.getCategories(query);

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: result,
    });
  },
);

const getCategoryById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    const category = await categoryService.getCategoryById(id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  },
);

const createCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const category = await categoryService.createCategory(req.body);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  },
);

const updateCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    const category = await categoryService.updateCategory(id, req.body);

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  },
);

const deleteCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    await categoryService.deleteCategory(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  },
);

const restoreCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    const category = await categoryService.restoreCategory(id);

    res.status(200).json({
      success: true,
      message: "Category restored successfully",
      data: category,
    });
  },
);

export const categoryController = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
};