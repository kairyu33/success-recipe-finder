/**
 * メンバーシップ関連のAPI呼び出し関数
 */

import type { Membership, MembershipFormData } from '@/types';

/**
 * 有効なメンバーシップ一覧を取得
 */
export async function fetchMemberships(): Promise<Membership[]> {
  const response = await fetch('/api/memberships');

  if (!response.ok) {
    throw new Error('メンバーシップの取得に失敗しました');
  }

  const data = await response.json();
  return data.memberships || [];
}

/**
 * 管理者用メンバーシップ一覧を取得
 */
export async function fetchAdminMemberships(): Promise<Membership[]> {
  const response = await fetch('/api/admin/memberships');

  if (!response.ok) {
    throw new Error('メンバーシップの取得に失敗しました');
  }

  const data = await response.json();
  return data.memberships || [];
}

/**
 * メンバーシップを作成
 */
export async function createMembership(
  data: MembershipFormData
): Promise<Membership> {
  const response = await fetch('/api/admin/memberships', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'メンバーシップの作成に失敗しました');
  }

  const result = await response.json();
  return result.membership;
}

/**
 * メンバーシップを更新
 */
export async function updateMembership(
  id: string,
  data: MembershipFormData
): Promise<Membership> {
  const response = await fetch(`/api/admin/memberships/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'メンバーシップの更新に失敗しました');
  }

  const result = await response.json();
  return result.membership;
}

/**
 * メンバーシップを削除
 */
export async function deleteMembership(id: string): Promise<void> {
  const response = await fetch(`/api/admin/memberships/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('メンバーシップの削除に失敗しました');
  }
}
