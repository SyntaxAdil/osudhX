import type { Order } from "../../generated/prisma/client";
import prisma from "../../lib/prisma";
import ApiError from "../../lib/ApiError";
import { resolvePagination, buildPaginationMeta, type PaginationMeta } from "../../lib/pagination";
import type { CreateOrderData, OrderQuery } from "../../types/order.types";

/**
 * Creates an order for a customer.
 *
 * Runs inside a transaction so that stock validation, stock decrement,
 * and order/order-item creation either all succeed or all roll back.
 */
const createOrder = async (userId: string, data: CreateOrderData): Promise<Order> => {
  if (data.items.length === 0) {
    throw new ApiError(400, "Order must contain at least one item");
  }

  return prisma.$transaction(async (tx) => {
    let totalAmount = 0;

    const orderItemsData = await Promise.all(
      data.items.map(async (item) => {
        const product = await tx.product.findFirst({
          where: { id: item.productId, isDeleted: false },
        });

        if (!product) {
          throw new ApiError(404, `Product not found: ${item.productId}`);
        }

        if (product.status !== "available") {
          throw new ApiError(400, `Product is not available: ${product.name}`);
        }

        if (product.stock < item.quantity) {
          throw new ApiError(400, `Insufficient stock for product: ${product.name}`);
        }

        totalAmount += product.price * item.quantity;

        return {
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        };
      }),
    );

    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        shippingAddress: data.shippingAddress,
        phone: data.phone,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: { orderItems: { include: { product: true } } },
    });

    // Decrement stock and flip status to "stockout" where applicable.
    await Promise.all(
      orderItemsData.map(async (item) => {
        const product = await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        if (product.stock <= 0) {
          await tx.product.update({
            where: { id: item.productId },
            data: { status: "stockout" },
          });
        }
      }),
    );

    return order;
  });
};

/**
 * Returns a paginated list of orders.
 *
 * Customers are restricted to their own orders; sellers see orders that
 * contain at least one of their own products.
 */
const getAllOrders = async (
  query: OrderQuery,
  requesterId: string,
  requesterRole: "customer" | "seller",
): Promise<{ orders: Order[]; meta: PaginationMeta }> => {
  const { page, limit, skip, take } = resolvePagination(query.page, query.limit);

  const where =
    requesterRole === "customer"
      ? { userId: requesterId, isDeleted: false, ...(query.status ? { status: query.status } : {}) }
      : {
          isDeleted: false,
          ...(query.status ? { status: query.status } : {}),
          orderItems: { some: { product: { sellerId: requesterId } } },
        };

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: query.sortOrder ?? "desc" },
      include: { orderItems: { include: { product: true } } },
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, meta: buildPaginationMeta(page, limit, total) };
};

/**
 * Fetches a single order, enforcing that the requester is either the
 * customer who placed it or a seller with a product in it.
 */
const getOrderById = async (
  id: string,
  requesterId: string,
  requesterRole: "customer" | "seller",
): Promise<Order> => {
  const order = await prisma.order.findFirst({
    where: { id, isDeleted: false },
    include: { orderItems: { include: { product: true } } },
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const isOwner = requesterRole === "customer" && order.userId === requesterId;
  const isSellerOfAnyItem =
    requesterRole === "seller" &&
    order.orderItems.some((item) => item.product.sellerId === requesterId);

  if (!isOwner && !isSellerOfAnyItem) {
    throw new ApiError(403, "Forbidden - You do not have access to this order");
  }

  return order;
};

/**
 * Advances an order's status. Restricted to sellers who own at least
 * one item in the order.
 */
const updateOrderStatus = async (
  id: string,
  sellerId: string,
  status: Order["status"],
): Promise<Order> => {
  const order = await getOrderById(id, sellerId, "seller");

  if (order.status === "cancelled" || order.status === "delivered") {
    throw new ApiError(400, `Cannot change status of a ${order.status} order`);
  }

  return prisma.order.update({
    where: { id },
    data: { status },
  });
};

/**
 * Cancels an order. Only the customer who placed it may cancel, and only
 * while it is still pending.
 */
const cancelOrder = async (id: string, userId: string): Promise<Order> => {
  const order = await getOrderById(id, userId, "customer");

  if (order.status !== "pending") {
    throw new ApiError(400, "Only pending orders can be cancelled");
  }

  return prisma.$transaction(async (tx) => {
    const orderItems = await tx.orderItem.findMany({ where: { orderId: id } });

    // Restore stock for each cancelled item.
    await Promise.all(
      orderItems.map((item) =>
        tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
            status: "available",
          },
        }),
      ),
    );

    return tx.order.update({
      where: { id },
      data: { status: "cancelled" },
    });
  });
};

const orderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};

export default orderService;
