import { type Request, type Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { productService } from "../services/product.services";

const getProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const query = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search:
        typeof req.query.search === "string"
          ? req.query.search
          : undefined,
      categoryId:
        typeof req.query.categoryId === "string"
          ? req.query.categoryId
          : undefined,
      status:
        typeof req.query.status === "string"
          ? (req.query.status as "available" | "sold" | "stockout")
          : undefined,
      sortBy:
        typeof req.query.sortBy === "string"
          ? (req.query.sortBy as "createdAt" | "price" | "name")
          : undefined,
      sortOrder:
        typeof req.query.sortOrder === "string"
          ? (req.query.sortOrder as "asc" | "desc")
          : undefined,
    };

    const result = await productService.getProducts(query);

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: result,
    });
  },
);

const getProductById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    const product = await productService.getProductById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  },
);

const createProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const product = await productService.createProduct(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  },
);

const updateProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    const product = await productService.updateProduct(id, req.body);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  },
);

const deleteProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    await productService.deleteProduct(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  },
);

const restoreProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    const product = await productService.restoreProduct(id);

    res.status(200).json({
      success: true,
      message: "Product restored successfully",
      data: product,
    });
  },
);

export const productController = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
};