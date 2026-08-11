import { PrismaClient } from "../generated/prisma/client";

/**
 * Prisma Client singleton.
 *
 * In development, Node's module cache is cleared on every file change
 * (hot reload), which would otherwise spin up a new PrismaClient per
 * reload and exhaust the Postgres connection pool. Caching the instance
 * on `globalThis` avoids that.
 */
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

const prisma = globalThis.prismaGlobal ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
