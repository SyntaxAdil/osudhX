import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../lib/sendResponse";
import ApiError from "../lib/ApiError";
import productService from "../services/product/product.service";
import type { CreateProductData, ProductQuery, UpdateProductData } from "../types/product.types";

/**
 * POST /api/products
 * Access: seller
 */
const createProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const sellerId = req.user?.sub as string | undefined;

  if (!sellerId) {
    throw new ApiError(401, "Unauthorized");
  }

  const payload = req.body as CreateProductData;
  const product = await productService.createProduct(sellerId, payload);

  sendResponse(res, {
    statusCode: 201,
    message: "Product created successfully",
    data: product,
  });
});

/**
 * GET /api/products
 * Access: public
 */
const getAllProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const query: ProductQuery = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    search: req.query.search as string | undefined,
    categoryId: req.query.categoryId as string | undefined,
    status: req.query.status as ProductQuery["status"],
    sortBy: req.query.sortBy as ProductQuery["sortBy"],
    sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
  };

  const { products, meta } = await productService.getAllProducts(query);

  sendResponse(res, {
    message: "Products retrieved successfully",
    data: products,
    meta,
  });
});

/**
 * GET /api/products/:id
 * Access: public
 */
const getProductById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const product = await productService.getProductById(id as string);

  sendResponse(res, {
    message: "Product retrieved successfully",
    data: product,
  });
});

/**
 * PATCH /api/products/:id
 * Access: seller (owner only)
 */
const updateProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const sellerId = req.user?.sub as string | undefined;

  if (!sellerId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id } = req.params;
  const payload = req.body as UpdateProductData;

  const product = await productService.updateProduct(id as string, sellerId, payload);

  sendResponse(res, {
    message: "Product updated successfully",
    data: product,
  });
});

/**
 * DELETE /api/products/:id
 * Access: seller (owner only)
 */
const deleteProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const sellerId = req.user?.sub as string | undefined;

  if (!sellerId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id } = req.params;

  await productService.deleteProduct(id as string, sellerId);

  sendResponse(res, {
    message: "Product deleted successfully",
  });
});

const productController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

export default productController;
