import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { orderService } from "../services/order.services";

const getOrders = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const query = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,

      status:
        typeof req.query.status === "string"
          ? (req.query.status as
              | "pending"
              | "confirmed"
              | "shipped"
              | "delivered"
              | "cancelled")
          : undefined,

      userId:
        typeof req.query.userId === "string" ? req.query.userId : undefined,

      sortOrder:
        req.query.sortOrder === "asc" ? ("asc" as const) : ("desc" as const),
    };

    const result = await orderService.getOrders(query);

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: result,
    });
  },
);

const getOrderById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
      return;
    }

    const order = await orderService.getOrderById(id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
    });
  },
);

const createOrder = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.sub) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const order = await orderService.createOrder(req.user.sub, req.body);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  },
);

const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
      return;
    }

    const order = await orderService.updateOrderStatus(id, req.body.status);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  },
);

const deleteOrder = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
      return;
    }

    await orderService.deleteOrder(id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  },
);

const restoreOrder = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
      return;
    }

    const order = await orderService.restoreOrder(id);

    res.status(200).json({
      success: true,
      message: "Order restored successfully",
      data: order,
    });
  },
);

export const orderController = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  restoreOrder,
};
