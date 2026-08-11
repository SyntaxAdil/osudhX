import { prisma } from "../lib/prisma";
import type { CategoryQuery } from "../types/category";

const getCategories = async (query: CategoryQuery) => {
  const {
    page = 1,
    limit = 10,
    search,
    sortOrder = "desc",
  } = query;

  const skip = (page - 1) * limit;

  const where = {
    isDeleted: false,
    ...(search && {
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
    }),
  };

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: sortOrder,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    }),

    prisma.category.count({
      where,
    }),
  ]);

  return {
    categories,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getCategoryById = async (id: string) => {
  return prisma.category.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      products: {
        where: {
          isDeleted: false,
        },
      },
    },
  });
};

const createCategory = async (data: {
  name: string;
  description?: string;
  image?: string;
}) => {
  return prisma.category.create({
    data: {
      name: data.name,
      description: data.description,
      image: data.image,
    },
  });
};

const updateCategory = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    image?: string;
  },
) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return prisma.category.update({
    where: {
      id,
    },
    data,
  });
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return prisma.category.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
};

const restoreCategory = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: true,
    },
  });

  if (!category) {
    throw new Error("Deleted category not found");
  }

  return prisma.category.update({
    where: {
      id,
    },
    data: {
      isDeleted: false,
    },
  });
};

export const categoryService = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
};