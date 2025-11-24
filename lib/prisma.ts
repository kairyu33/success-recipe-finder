/**
 * Prisma Client Singleton
 *
 * @description Prevents connection pool exhaustion by reusing a single PrismaClient instance
 * This is critical for serverless environments like Vercel where each function invocation
 * could create a new database connection.
 *
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
 */

import { PrismaClient } from '@prisma/client';

/**
 * Global type augmentation for PrismaClient caching
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Singleton Prisma Client instance
 *
 * In production: Creates a new instance
 * In development: Reuses cached instance to prevent hot-reload connection issues
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

/**
 * Cache the Prisma instance in development to survive hot-reloads
 */
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown handler
 * Ensures database connections are properly closed on process termination
 */
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

export default prisma;
