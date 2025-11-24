/**
 * メンバーシップリストコンポーネント
 */

'use client';

import type { Membership } from '@/types';

type MembershipListProps = {
  memberships: Membership[];
  onEdit: (membership: Membership) => void;
  onDelete: (id: string) => void;
};

export function MembershipList({
  memberships,
  onEdit,
  onDelete,
}: MembershipListProps) {
  if (memberships.length === 0) {
    return (
      <div className="bg-white p-12 rounded-lg shadow text-center">
        <p className="text-gray-600">メンバーシップがまだ登録されていません</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                名前
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                カラー
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                説明
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                表示順序
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                ステータス
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {memberships.map((membership) => (
              <tr key={membership.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-3 py-1 rounded text-sm text-white font-medium"
                      style={{ backgroundColor: membership.color || '#3B82F6' }}
                    >
                      {membership.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: membership.color || '#3B82F6' }}
                    />
                    <span className="text-sm text-gray-600">
                      {membership.color}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {membership.description || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {membership.sortOrder}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                      membership.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {membership.isActive ? '有効' : '無効'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => onEdit(membership)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => onDelete(membership.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
