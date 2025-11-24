/**
 * メンバーシップフォームコンポーネント
 */

'use client';

import type { MembershipFormData } from '@/types';

type MembershipFormProps = {
  formData: MembershipFormData;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (data: Partial<MembershipFormData>) => void;
  onCancel: () => void;
};

export function MembershipForm({
  formData,
  isEditing,
  onSubmit,
  onChange,
  onCancel,
}: MembershipFormProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? 'メンバーシップ編集' : '新規メンバーシップ作成'}
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              メンバーシップ名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">カラー</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => onChange({ color: e.target.value })}
                className="h-10 w-20 border rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => onChange({ color: e.target.value })}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="#3B82F6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">表示順序</label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) =>
                onChange({ sortOrder: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ステータス</label>
            <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => onChange({ isActive: e.target.checked })}
                className="rounded"
              />
              <span>有効</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">説明</label>
            <textarea
              value={formData.description}
              onChange={(e) => onChange({ description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            {isEditing ? '更新' : '作成'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 font-medium"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
