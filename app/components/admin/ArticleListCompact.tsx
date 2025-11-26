/**
 * 記事リスト（コンパクト版・1行表示）
 */

'use client';

import type { Article, Membership } from '@/types';
import { formatNumber } from '@/lib/utils';

type ArticleListCompactProps = {
  articles: Article[];
  memberships: Membership[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onMembershipToggle: (articleId: string, membershipId: string) => void;
};

export function ArticleListCompact({
  articles,
  memberships,
  onEdit,
  onDelete,
  onMembershipToggle,
}: ArticleListCompactProps) {
  if (articles.length === 0) {
    return (
      <div className="bg-white p-12 rounded-lg shadow text-center">
        <p className="text-gray-600">記事が見つかりません</p>
      </div>
    );
  }

  const getArticleMembershipIds = (article: Article): string[] => {
    return article.memberships.map((m) => m.membership.id);
  };

  return (
    <div className="space-y-2">
      {articles.map((article) => {
        const articleMembershipIds = getArticleMembershipIds(article);

        return (
          <div
            key={article.id}
            className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* タイトル - 5列 */}
              <div className="col-span-5">
                <div className="font-medium text-sm text-neutral-800 line-clamp-1">
                  {article.title}
                </div>
                <a
                  href={article.noteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline line-clamp-1"
                >
                  {article.noteLink}
                </a>
              </div>

              {/* ジャンル - 2列 */}
              <div className="col-span-2">
                <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                  {article.genre}
                </span>
              </div>

              {/* 文字数 - 1列 */}
              <div className="col-span-1 text-sm text-neutral-600 text-center">
                {formatNumber(article.characterCount)}
              </div>

              {/* メンバーシップチェックボックス - 2列 */}
              <div className="col-span-2">
                <div className="flex flex-wrap gap-1">
                  {memberships.map((membership) => (
                    <label
                      key={membership.id}
                      className="inline-flex items-center gap-1 cursor-pointer group"
                      title={membership.name}
                    >
                      <input
                        type="checkbox"
                        checked={articleMembershipIds.includes(membership.id)}
                        onChange={() => onMembershipToggle(article.id, membership.id)}
                        className="w-3 h-3 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span
                        className="w-4 h-4 rounded"
                        style={{
                          backgroundColor: membership.color || '#3B82F6',
                        }}
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* 操作ボタン - 2列 */}
              <div className="col-span-2 flex justify-end gap-2">
                <button
                  onClick={() => onEdit(article)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium"
                >
                  編集
                </button>
                <button
                  onClick={() => onDelete(article.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
