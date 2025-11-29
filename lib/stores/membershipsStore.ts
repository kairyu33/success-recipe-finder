/**
 * Memberships Store - Prisma Database Storage
 *
 * @description Manages membership data using Prisma ORM with PostgreSQL
 */

import { prisma } from '@/lib/prisma';
import type { Membership, MembershipFormData } from '@/types';

/**
 * Get all memberships
 */
export async function getMemberships(options?: {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<Membership[]> {
  const sortBy = options?.sortBy || 'sortOrder';
  const sortOrder = options?.sortOrder || 'asc';

  const dbMemberships = await prisma.membership.findMany({
    orderBy: { [sortBy]: sortOrder },
  });

  return dbMemberships.map((m) => ({
    id: m.id,
    name: m.name,
    description: m.description,
    color: m.color,
    sortOrder: m.sortOrder,
    isActive: m.isActive,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  }));
}

/**
 * Get a single membership by ID
 */
export async function getMembershipById(
  id: string
): Promise<Membership | null> {
  const membership = await prisma.membership.findUnique({
    where: { id },
  });

  if (!membership) return null;

  return {
    id: membership.id,
    name: membership.name,
    description: membership.description,
    color: membership.color,
    sortOrder: membership.sortOrder,
    isActive: membership.isActive,
    createdAt: membership.createdAt.toISOString(),
    updatedAt: membership.updatedAt.toISOString(),
  };
}

/**
 * Create a new membership
 */
export async function createMembership(
  data: MembershipFormData
): Promise<Membership> {
  // Check for duplicate name
  const existing = await prisma.membership.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new Error('Membership with this name already exists');
  }

  const membership = await prisma.membership.create({
    data: {
      name: data.name,
      description: data.description || null,
      color: data.color || null,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    },
  });

  return {
    id: membership.id,
    name: membership.name,
    description: membership.description,
    color: membership.color,
    sortOrder: membership.sortOrder,
    isActive: membership.isActive,
    createdAt: membership.createdAt.toISOString(),
    updatedAt: membership.updatedAt.toISOString(),
  };
}

/**
 * Update an existing membership
 */
export async function updateMembership(
  id: string,
  data: Partial<MembershipFormData>
): Promise<Membership> {
  // Check for duplicate name if being updated
  if (data.name) {
    const duplicate = await prisma.membership.findFirst({
      where: {
        name: data.name,
        NOT: { id },
      },
    });

    if (duplicate) {
      throw new Error('Membership with this name already exists');
    }
  }

  const membership = await prisma.membership.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.color !== undefined && { color: data.color }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });

  return {
    id: membership.id,
    name: membership.name,
    description: membership.description,
    color: membership.color,
    sortOrder: membership.sortOrder,
    isActive: membership.isActive,
    createdAt: membership.createdAt.toISOString(),
    updatedAt: membership.updatedAt.toISOString(),
  };
}

/**
 * Delete a membership by ID
 */
export async function deleteMembership(id: string): Promise<boolean> {
  try {
    await prisma.membership.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get storage info for debugging
 */
export function getStorageInfo(): { type: 'database'; production: boolean } {
  return {
    type: 'database',
    production: process.env.VERCEL === '1',
  };
}
