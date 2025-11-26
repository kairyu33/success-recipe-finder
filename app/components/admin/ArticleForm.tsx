/**
 * 記事フォームコンポーネント
 */

'use client';

import { useState } from 'react';
import type { ArticleFormData, Membership } from '@/types';

type ArticleFormProps = {
  formData: ArticleFormData;
  memberships: Membership[];
  availableGenres: string[];
  availableBenefits: string[];
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (data: Partial<ArticleFormData>) => void;
  onCancel: () => void;
};

export function ArticleForm({
  formData,
  memberships,
  availableGenres,
  availableBenefits,
  isEditing,
  onSubmit,
  onChange,
  onCancel,
}: ArticleFormProps) {
  const [customBenefit, setCustomBenefit] = useState('');
  const [customGenre, setCustomGenre] = useState('');
  const [showCustomGenreInput, setShowCustomGenreInput] = useState(false);

  // 選択中のメリットを配列として取得
  const selectedBenefits = formData.benefit
    ? formData.benefit.split(',').map((b) => b.trim()).filter(Boolean)
    : [];

  // メリット追加
  const handleAddBenefit = () => {
    const newBenefit = customBenefit.trim();
    if (newBenefit && !selectedBenefits.includes(newBenefit)) {
      onChange({ benefit: [...selectedBenefits, newBenefit].join(', ') });
      setCustomBenefit('');
    }
  };

  // メリット削除
  const handleRemoveBenefit = (benefitToRemove: string) => {
    const newBenefits = selectedBenefits.filter((b) => b !== benefitToRemove);
    onChange({ benefit: newBenefits.join(', ') });
  };

  // メリット選択トグル
  const handleToggleBenefit = (benefit: string) => {
    if (selectedBenefits.includes(benefit)) {
      handleRemoveBenefit(benefit);
    } else {
      onChange({ benefit: [...selectedBenefits, benefit].join(', ') });
    }
  };

  // カスタムジャンル追加
  const handleAddCustomGenre = () => {
    const newGenre = customGenre.trim();
    if (newGenre) {
      onChange({ genre: newGenre });
      setCustomGenre('');
      setShowCustomGenreInput(false);
    }
  };

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
            <div className="space-y-2">
              {/* 既存のジャンルから選択 */}
              <div className="flex flex-wrap gap-2">
                {availableGenres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => onChange({ genre })}
                    className={`px-4 py-2 border rounded-lg text-sm transition-all ${
                      formData.genre === genre
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white hover:bg-gray-100 border-gray-300'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowCustomGenreInput(!showCustomGenreInput)}
                  className="px-4 py-2 border-2 border-dashed border-green-400 rounded-lg text-sm text-green-700 hover:bg-green-50 transition-all"
                >
                  + 新しいジャンル
                </button>
              </div>

              {/* カスタムジャンル入力 */}
              {showCustomGenreInput && (
                <div className="flex gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <input
                    type="text"
                    value={customGenre}
                    onChange={(e) => setCustomGenre(e.target.value)}
                    placeholder="新しいジャンル名を入力..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomGenre();
                      }
                      if (e.key === 'Escape') {
                        setShowCustomGenreInput(false);
                        setCustomGenre('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomGenre}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    追加
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomGenreInput(false);
                      setCustomGenre('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    キャンセル
                  </button>
                </div>
              )}

              {/* 選択中のジャンルを表示 */}
              {formData.genre && (
                <div className="text-sm text-gray-600">
                  選択中: <span className="font-semibold text-blue-600">{formData.genre}</span>
                </div>
              )}
            </div>
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
              読者メリット（複数選択可）
            </label>
            <div className="space-y-3">
              {/* 選択されたメリット表示 */}
              {selectedBenefits.length > 0 && (
                <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                  <div className="text-xs font-semibold text-blue-900 mb-2">
                    選択中のメリット:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedBenefits.map((benefit) => (
                      <div
                        key={benefit}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
                      >
                        <span>{benefit}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBenefit(benefit)}
                          className="hover:bg-blue-700 rounded-full p-0.5"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 既存のメリットから選択 */}
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="text-xs font-semibold text-gray-700 mb-2">
                  既存のメリットから選択:
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableBenefits.map((benefit) => {
                    const isSelected = selectedBenefits.includes(benefit);
                    return (
                      <button
                        key={benefit}
                        type="button"
                        onClick={() => handleToggleBenefit(benefit)}
                        className={`px-3 py-2 border rounded-lg text-sm transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white hover:bg-gray-100 border-gray-300'
                        }`}
                      >
                        {benefit}
                      </button>
                    );
                  })}
                  {availableBenefits.length === 0 && (
                    <p className="text-sm text-gray-500">
                      まだメリットが登録されていません。下から追加してください。
                    </p>
                  )}
                </div>
              </div>

              {/* カスタムメリット追加 */}
              <div className="p-4 border rounded-lg bg-green-50">
                <div className="text-xs font-semibold text-green-900 mb-2">
                  新しいメリットを追加:
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customBenefit}
                    onChange={(e) => setCustomBenefit(e.target.value)}
                    placeholder="例: 初心者でもわかりやすい"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddBenefit();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddBenefit}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    追加
                  </button>
                </div>
              </div>
            </div>
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
