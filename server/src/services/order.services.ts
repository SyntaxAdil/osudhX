import { prisma } from "../lib/prisma";
import type { OrderQuery } from "../types/order";

const getOrders = async (query: OrderQuery) => {
  const { page = 1, limit = 10, status, userId, sortOrder = "desc" } = query;

  const skip = (page - 1) * limit;

  const where = {
    isDeleted: false,
    ...(status && { status }),
    ...(userId && { userId }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: sortOrder,
      },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    }),

    prisma.order.count({
      where,
    }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getOrderById = async (id: string) => {
  return prisma.order.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
};

const createOrder = async (
  userId: string,
  data: {
    shippingAddress: string;
    phone: string;
    items: {
      productId: string;
      quantity: number;
    }[];
  },
) => {
  if (!data.items || data.items.length === 0) {
    throw new Error("Order must contain at least one product");
  }

  const productIds = data.items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
      isDeleted: false,
      status: "available",
    },
  });

  if (products.length !== productIds.length) {
    throw new Error("One or more products are unavailable");
  }

  const productMap = new Map(products.map((product) => [product.id, product]));

  let totalAmount = 0;

  const orderItems = data.items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (item.quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    totalAmount += product.price * item.quantity;

    return {
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
    };
  });

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        shippingAddress: data.shippingAddress,
        phone: data.phone,
        totalAmount,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    for (const item of data.items) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return order;
  });
};

const updateOrderStatus = async (
  id: string,
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled",
) => {
  const order = await prisma.order.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return prisma.order.update({
    where: {
      id,
    },
    data: {
      status,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
};

const deleteOrder = async (id: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return prisma.order.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
};

const restoreOrder = async (id: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id,
      isDeleted: true,
    },
  });

  if (!order) {
    throw new Error("Deleted order not found");
  }

  return prisma.order.update({
    where: {
      id,
    },
    data: {
      isDeleted: false,
    },
  });
};

export const orderService = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  restoreOrder,
};
