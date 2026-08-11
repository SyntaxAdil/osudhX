import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../lib/sendResponse";
import ApiError from "../lib/ApiError";
import wishlistService from "../services/wishlist/wishlist.service";
import type { CreateWishlistData, WishlistQuery } from "../types/wishlist.types";

/**
 * POST /api/wishlist
 * Access: customer
 */
const addToWishlist = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.sub as string | undefined;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { productId } = req.body as CreateWishlistData;
  const entry = await wishlistService.addToWishlist(userId, productId);

  sendResponse(res, {
    statusCode: 201,
    message: "Product added to wishlist",
    data: entry,
  });
});

/**
 * GET /api/wishlist
 * Access: customer (own wishlist)
 */
const getWishlist = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.sub as string | undefined;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const query: WishlistQuery = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
  };

  const { wishlist, meta } = await wishlistService.getWishlist(userId, query);

  sendResponse(res, {
    message: "Wishlist retrieved successfully",
    data: wishlist,
    meta,
  });
});


const getWishlistById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.sub as string | undefined;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id } = req.params;
  const entry = await wishlistService.getWishlistById(id as string, userId);

  sendResponse(res, {
    message: "Wishlist entry retrieved successfully",
    data: entry,
  });
});


const removeFromWishlist = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.sub as string | undefined;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id } = req.params;
  await wishlistService.removeFromWishlist(id as string, userId);

  sendResponse(res, {
    message: "Product removed from wishlist",
  });
});

const wishlistController = {
  addToWishlist,
  getWishlist,
  getWishlistById,
  removeFromWishlist,
};

export default wishlistController;