import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../lib/sendResponse";
import ApiError from "../lib/ApiError";
import orderService from "../services/order/order.service";
import type { CreateOrderData, OrderQuery, UpdateOrderStatusData } from "../types/order.types";

/**
 * POST /api/orders
 * Access: customer
 */
const createOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.sub as string | undefined;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const payload = req.body as CreateOrderData;
  const order = await orderService.createOrder(userId, payload);

  sendResponse(res, {
    statusCode: 201,
    message: "Order placed successfully",
    data: order,
  });
});

/**
 * GET /api/orders
 * Access: customer (own orders), seller (orders containing their products)
 */
const getAllOrders = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const requesterId = req.user?.sub as string | undefined;
  const requesterRole = req.user?.role;

  if (!requesterId || !requesterRole) {
    throw new ApiError(401, "Unauthorized");
  }

  const query: OrderQuery = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    status: req.query.status as OrderQuery["status"],
    sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
  };

  const { orders, meta } = await orderService.getAllOrders(query, requesterId, requesterRole);

  sendResponse(res, {
    message: "Orders retrieved successfully",
    data: orders,
    meta,
  });
});

/**
 * GET /api/orders/:id
 * Access: order owner (customer) or seller with a product in the order
 */
const getOrderById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const requesterId = req.user?.sub as string | undefined;
  const requesterRole = req.user?.role;

  if (!requesterId || !requesterRole) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id } = req.params;
  const order = await orderService.getOrderById(id as string, requesterId, requesterRole);

  sendResponse(res, {
    message: "Order retrieved successfully",
    data: order,
  });
});

/**
 * PATCH /api/orders/:id/status
 * Access: seller
 */
const updateOrderStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const sellerId = req.user?.sub as string | undefined;

  if (!sellerId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id } = req.params;
  const { status } = req.body as UpdateOrderStatusData;

  const order = await orderService.updateOrderStatus(id as string, sellerId, status);

  sendResponse(res, {
    message: "Order status updated successfully",
    data: order,
  });
});

/**
 * PATCH /api/orders/:id/cancel
 * Access: customer (order owner)
 */
const cancelOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.sub as string | undefined;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id } = req.params;
  const order = await orderService.cancelOrder(id as string, userId);

  sendResponse(res, {
    message: "Order cancelled successfully",
    data: order,
  });
});

const orderController = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};

export default orderController;
