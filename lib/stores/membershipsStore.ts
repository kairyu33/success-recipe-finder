/**
 * Memberships Store - Hybrid storage system (Local JSON + Vercel Blob)
 *
 * @description Manages membership data using:
 * - Local: JSON file storage for development
 * - Production: Vercel Blob for persistent cloud storage
 */

import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';
import type { Membership, MembershipFormData } from '@/types';

/**
 * Data structure for storage
 */
interface MembershipsData {
  memberships: Membership[];
  lastModified: string;
}

// Storage configuration
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const IS_PRODUCTION = process.env.VERCEL === '1';
const BLOB_FILENAME = 'memberships.json';
const DISABLE_BLOB = process.env.DISABLE_BLOB === 'true';

// Local storage paths
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'memberships.json');

/**
 * Check if we should use Vercel Blob storage
 */
function shouldUseBlob(): boolean {
  // Allow disabling Blob storage via environment variable
  if (DISABLE_BLOB) {
    return false;
  }
  return IS_PRODUCTION && !!BLOB_TOKEN;
}

/**
 * Ensure local data directory and file exist
 */
async function ensureLocalDataFile(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  try {
    await fs.access(DATA_FILE);
  } catch {
    const initialData: MembershipsData = {
      memberships: [],
      lastModified: new Date().toISOString()
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

/**
 * Read memberships from storage
 */
async function readMemberships(): Promise<Membership[]> {
  if (shouldUseBlob()) {
    try {
      const blobUrl = `${process.env.BLOB_URL_PREFIX}/${BLOB_FILENAME}`;
      const response = await fetch(blobUrl);

      if (!response.ok) {
        console.log('Blob not found, initializing empty data');
        return [];
      }

      const data: MembershipsData = await response.json();
      return data.memberships || [];
    } catch (error) {
      console.error('Error reading from Blob:', error);
      return [];
    }
  } else {
    await ensureLocalDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed: MembershipsData = JSON.parse(data);
    return parsed.memberships || [];
  }
}

/**
 * Write memberships to storage
 */
async function writeMemberships(memberships: Membership[]): Promise<void> {
  const data: MembershipsData = {
    memberships,
    lastModified: new Date().toISOString()
  };

  const jsonContent = JSON.stringify(data, null, 2);

  if (shouldUseBlob()) {
    try {
      await put(BLOB_FILENAME, jsonContent, {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
      });
      console.log('Successfully wrote to Vercel Blob');
    } catch (error) {
      console.error('Error writing to Blob:', error);
      throw new Error('Failed to write to Blob storage');
    }
  } else {
    await ensureLocalDataFile();
    await fs.writeFile(DATA_FILE, jsonContent, 'utf-8');
  }
}

/**
 * Get all memberships
 */
export async function getMemberships(options?: {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<Membership[]> {
  let memberships = await readMemberships();

  // Sort memberships
  const sortBy = options?.sortBy || 'sortOrder';
  const sortOrder = options?.sortOrder || 'asc';

  memberships.sort((a, b) => {
    let aValue: any = (a as any)[sortBy];
    let bValue: any = (b as any)[sortBy];

    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return memberships;
}

/**
 * Get a single membership by ID
 */
export async function getMembershipById(id: string): Promise<Membership | null> {
  const memberships = await readMemberships();
  return memberships.find(m => m.id === id) || null;
}

/**
 * Create a new membership
 */
export async function createMembership(
  data: MembershipFormData
): Promise<Membership> {
  const memberships = await readMemberships();

  // Check for duplicate name
  const existing = memberships.find(m => m.name === data.name);
  if (existing) {
    throw new Error('Membership with this name already exists');
  }

  const now = new Date().toISOString();
  const newMembership: Membership = {
    id: uuidv4(),
    name: data.name,
    description: data.description || null,
    color: data.color || null,
    sortOrder: data.sortOrder ?? 0,
    isActive: data.isActive ?? true,
    createdAt: now,
    updatedAt: now,
  };

  memberships.push(newMembership);
  await writeMemberships(memberships);

  return newMembership;
}

/**
 * Update an existing membership
 */
export async function updateMembership(
  id: string,
  data: Partial<MembershipFormData>
): Promise<Membership> {
  const memberships = await readMemberships();
  const index = memberships.findIndex(m => m.id === id);

  if (index === -1) {
    throw new Error('Membership not found');
  }

  // Check for duplicate name if being updated
  if (data.name && data.name !== memberships[index].name) {
    const duplicate = memberships.find(m => m.name === data.name);
    if (duplicate) {
      throw new Error('Membership with this name already exists');
    }
  }

  const updatedMembership: Membership = {
    ...memberships[index],
    ...(data.name !== undefined && { name: data.name }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.color !== undefined && { color: data.color }),
    ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
    ...(data.isActive !== undefined && { isActive: data.isActive }),
    updatedAt: new Date().toISOString()
  };

  memberships[index] = updatedMembership;
  await writeMemberships(memberships);

  return updatedMembership;
}

/**
 * Delete a membership by ID
 */
export async function deleteMembership(id: string): Promise<boolean> {
  const memberships = await readMemberships();
  const index = memberships.findIndex(m => m.id === id);

  if (index === -1) {
    return false;
  }

  memberships.splice(index, 1);
  await writeMemberships(memberships);

  return true;
}

/**
 * Get storage info for debugging
 */
export function getStorageInfo(): { type: 'blob' | 'local'; production: boolean } {
  return {
    type: shouldUseBlob() ? 'blob' : 'local',
    production: IS_PRODUCTION
  };
}
