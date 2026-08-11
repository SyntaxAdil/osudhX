import { prisma } from "../lib/prisma";
import type {
  CreateProductData,
  ProductQuery,
  UpdateProductData,
} from "../types/product";

const getProducts = async (query: ProductQuery) => {
  const {
    page = 1,
    limit = 10,
    search,
    categoryId,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const where = {
    isDeleted: false,

    ...(search && {
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
    }),

    ...(categoryId && { categoryId }),

    ...(status && { status }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getProductById = async (id: string) => {
  return prisma.product.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      category: true,
    },
  });
};

const createProduct = async (data: CreateProductData) => {
  return prisma.product.create({
    data,
    include: {
      category: true,
    },
  });
};

const updateProduct = async (id: string, data: UpdateProductData) => {
  return prisma.product.update({
    where: {
      id,
    },
    data,
    include: {
      category: true,
    },
  });
};

const deleteProduct = async (id: string) => {
  return prisma.product.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
};

const restoreProduct = async (id: string) => {
  return prisma.product.update({
    where: {
      id,
    },
    data: {
      isDeleted: false,
    },
  });
};

export const productService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
};
