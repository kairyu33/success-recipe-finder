/**
 * 記事リストコンポーネント
 */

'use client';

import type { Article } from '@/types';
import { formatNumber } from '@/lib/utils';

type ArticleListProps = {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
};

export function ArticleList({ articles, onEdit, onDelete }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="bg-white p-12 rounded-lg shadow text-center">
        <p className="text-gray-600">記事がまだ登録されていません</p>
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
                タイトル
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                ジャンル
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                文字数
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                メンバーシップ
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-sm">{article.title}</div>
                  <a
                    href={article.noteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {article.noteLink.substring(0, 50)}...
                  </a>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    {article.genre}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatNumber(article.characterCount)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {article.memberships.map((m) => (
                      <span
                        key={m.membership.id}
                        className="px-2 py-1 rounded text-xs text-white"
                        style={{
                          backgroundColor: m.membership.color || '#3B82F6',
                        }}
                      >
                        {m.membership.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
