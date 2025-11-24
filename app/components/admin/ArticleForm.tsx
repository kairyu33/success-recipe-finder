/**
 * 記事フォームコンポーネント
 */

'use client';

import type { ArticleFormData, Membership } from '@/types';

type ArticleFormProps = {
  formData: ArticleFormData;
  memberships: Membership[];
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (data: Partial<ArticleFormData>) => void;
  onCancel: () => void;
};

export function ArticleForm({
  formData,
  memberships,
  isEditing,
  onSubmit,
  onChange,
  onCancel,
}: ArticleFormProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? '記事編集' : '新規記事作成'}
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              noteリンク <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.noteLink}
              onChange={(e) => onChange({ noteLink: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              公開日 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.publishedAt}
              onChange={(e) => onChange({ publishedAt: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">文字数</label>
            <input
              type="number"
              value={formData.characterCount}
              onChange={(e) =>
                onChange({ characterCount: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              推定読了時間（分）
            </label>
            <input
              type="number"
              value={formData.estimatedReadTime}
              onChange={(e) =>
                onChange({ estimatedReadTime: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ジャンル</label>
            <input
              type="text"
              value={formData.genre}
              onChange={(e) => onChange({ genre: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              ターゲット読者層
            </label>
            <input
              type="text"
              value={formData.targetAudience}
              onChange={(e) => onChange({ targetAudience: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              おすすめ度
            </label>
            <input
              type="text"
              value={formData.recommendationLevel}
              onChange={(e) =>
                onChange({ recommendationLevel: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              読者メリット
            </label>
            <textarea
              value={formData.benefit}
              onChange={(e) => onChange({ benefit: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              メンバーシップタグ
            </label>
            <div className="flex flex-wrap gap-2">
              {memberships.map((membership) => (
                <label
                  key={membership.id}
                  className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.membershipIds.includes(membership.id)}
                    onChange={(e) => {
                      const newIds = e.target.checked
                        ? [...formData.membershipIds, membership.id]
                        : formData.membershipIds.filter(
                            (id) => id !== membership.id
                          );
                      onChange({ membershipIds: newIds });
                    }}
                    className="rounded"
                  />
                  <span
                    className="px-2 py-1 rounded text-xs text-white"
                    style={{
                      backgroundColor: membership.color || '#3B82F6',
                    }}
                  >
                    {membership.name}
                  </span>
                </label>
              ))}
            </div>
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
