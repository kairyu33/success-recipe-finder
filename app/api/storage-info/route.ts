/**
 * Storage Info API - Debug endpoint
 *
 * @description Returns information about the current storage configuration
 */

import { NextResponse } from 'next/server';
import { getStorageInfo } from '@/lib/stores/articlesStore';

/**
 * GET /api/storage-info
 *
 * @description Get current storage configuration
 */
export async function GET() {
  try {
    const storageInfo = getStorageInfo();

    return NextResponse.json({
      storage: storageInfo.type,
      isProduction: storageInfo.production,
      environment: process.env.NODE_ENV,
      vercel: process.env.VERCEL === '1',
      blobConfigured: !!process.env.BLOB_READ_WRITE_TOKEN,
      message: storageInfo.type === 'blob'
        ? 'Using Vercel Blob storage (production)'
        : 'Using local JSON file storage (development)'
    });

  } catch (error) {
    console.error('Error getting storage info:', error);

    return NextResponse.json(
      { error: 'Failed to get storage info', details: String(error) },
      { status: 500 }
    );
  }
}
