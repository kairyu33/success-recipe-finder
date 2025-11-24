'use client';

import { useState, useEffect } from 'react';

type Article = {
  id: string;
  title: string;
  noteLink: string;
  publishedAt: string;
  characterCount: number;
  estimatedReadTime: number;
  genre: string;
  targetAudience: string;
  benefit: string;
  recommendationLevel: string;
  memberships: Array<{
    membership: {
      id: string;
      name: string;
      color: string | null;
    };
  }>;
};

type Membership = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  sortOrder: number;
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMembershipId, setSelectedMembershipId] = useState<string>('');

  useEffect(() => {
    fetchMemberships();
    fetchArticles();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [selectedMembershipId, search]);

  const fetchMemberships = async () => {
    try {
      const res = await fetch('/api/memberships');
      const data = await res.json();
      setMemberships(data.memberships || []);
    } catch (error) {
      console.error('メンバーシップ取得エラー:', error);
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedMembershipId) {
        params.append('membershipId', selectedMembershipId);
      }
      if (search) {
        params.append('search', search);
      }
      params.append('limit', '100');

      const res = await fetch(`/api/articles?${params}`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('記事取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">記事検索</h1>
          <p className="text-gray-600">
            メンバーシップタグで記事を絞り込んで検索できます
          </p>
        </div>

        {/* 検索とフィルター */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="space-y-4">
            {/* 検索バー */}
            <div>
              <label className="block text-sm font-medium mb-2">
                キーワード検索
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="タイトル、ジャンル、ユーザー層、メリットで検索..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* メンバーシップフィルター */}
            <div>
              <label className="block text-sm font-medium mb-2">
                メンバーシップで絞り込み
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedMembershipId('')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedMembershipId === ''
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  すべて
                </button>
                {memberships.map((membership) => (
                  <button
                    key={membership.id}
                    onClick={() => setSelectedMembershipId(membership.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedMembershipId === membership.id
                        ? 'text-white'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor:
                        selectedMembershipId === membership.id
                          ? membership.color || '#3B82F6'
                          : membership.color || '#E5E7EB',
                      color:
                        selectedMembershipId === membership.id
                          ? 'white'
                          : '#374151',
                    }}
                  >
                    {membership.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 記事一覧 */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-xl text-gray-600">読み込み中...</div>
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-gray-600 text-lg">
              {selectedMembershipId || search
                ? '条件に合う記事が見つかりませんでした'
                : '記事がまだ登録されていません'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 line-clamp-2">
                    {article.title}
                  </h2>

                  <div className="space-y-2 mb-4">
                    {article.genre && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">ジャンル:</span>
                        <span className="font-medium">{article.genre}</span>
                      </div>
                    )}

                    {article.targetAudience && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">対象:</span>
                        <span className="font-medium">
                          {article.targetAudience}
                        </span>
                      </div>
                    )}

                    {article.recommendationLevel && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">おすすめ度:</span>
                        <span className="font-medium">
                          {article.recommendationLevel}
                        </span>
                      </div>
                    )}
                  </div>

                  {article.benefit && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {article.benefit}
                    </p>
                  )}

                  {/* メンバーシップタグ */}
                  {article.memberships.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.memberships.map((m) => (
                        <span
                          key={m.membership.id}
                          className="px-2 py-1 rounded text-xs text-white font-medium"
                          style={{
                            backgroundColor: m.membership.color || '#3B82F6',
                          }}
                        >
                          {m.membership.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>
                      {article.characterCount.toLocaleString()}文字
                    </span>
                    <span>約{article.estimatedReadTime}分</span>
                  </div>

                  <a
                    href={article.noteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    記事を読む
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
