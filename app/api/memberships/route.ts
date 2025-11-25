/**
 * Public Memberships API - File-based storage
 *
 * @description Handles public membership listing using JSON file storage
 */

import { NextResponse } from 'next/server';
import { getMemberships } from '@/lib/stores/membershipsStore';

/**
 * GET /api/memberships
 *
 * @description Get active memberships (public endpoint)
 */
export async function GET() {
  try {
    const allMemberships = await getMemberships({
      sortBy: 'sortOrder',
      sortOrder: 'asc',
    });

    // Filter only active memberships for public endpoint
    const memberships = allMemberships.filter(m => m.isActive);

    return NextResponse.json({ memberships });
  } catch (error) {
    console.error('メンバーシップ取得エラー:', error);
    return NextResponse.json(
      { error: 'メンバーシップの取得に失敗しました' },
      { status: 500 }
    );
  }
}
