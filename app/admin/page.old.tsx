'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

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
    membership: Membership;
  }>;
};

type Membership = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  sortOrder: number;
  isActive: boolean;
};

type Tab = 'articles' | 'memberships';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<Tab>('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  // CSV一括登録状態
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<any>(null);

  // 記事フォーム状態
  const [articleForm, setArticleForm] = useState({
    title: '',
    noteLink: '',
    publishedAt: '',
    characterCount: 0,
    estimatedReadTime: 0,
    genre: '',
    targetAudience: '',
    benefit: '',
    recommendationLevel: '',
    membershipIds: [] as string[],
  });
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [showArticleForm, setShowArticleForm] = useState(false);

  // メンバーシップフォーム状態
  const [membershipForm, setMembershipForm] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    sortOrder: 0,
    isActive: true,
  });
  const [editingMembershipId, setEditingMembershipId] = useState<string | null>(null);
  const [showMembershipForm, setShowMembershipForm] = useState(false);

  // 認証チェック
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // シンプルな認証チェック（admin123）
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setAuthError('');
      fetchData();
    } else {
      setAuthError('パスワードが正しくありません');
    }
  };

  // データ取得
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [articlesRes, membershipsRes] = await Promise.all([
        fetch('/api/admin/articles'),
        fetch('/api/admin/memberships'),
      ]);

      if (articlesRes.ok) {
        const data = await articlesRes.json();
        setArticles(data.articles);
      }

      if (membershipsRes.ok) {
        const data = await membershipsRes.json();
        setMemberships(data.memberships);
      }
    } catch (error) {
      console.error('データ取得エラー:', error);
      toast.error('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 記事操作
  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingArticleId
        ? `/api/admin/articles/${editingArticleId}`
        : '/api/admin/articles';
      const method = editingArticleId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleForm),
      });

      if (res.ok) {
        toast.success(
          editingArticleId ? '記事を更新しました' : '記事を作成しました'
        );
        resetArticleForm();
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || '操作に失敗しました');
      }
    } catch (error) {
      console.error('記事操作エラー:', error);
      toast.error('操作に失敗しました');
    }
  };

  const handleArticleEdit = (article: Article) => {
    setArticleForm({
      title: article.title,
      noteLink: article.noteLink,
      publishedAt: article.publishedAt.split('T')[0],
      characterCount: article.characterCount,
      estimatedReadTime: article.estimatedReadTime,
      genre: article.genre,
      targetAudience: article.targetAudience,
      benefit: article.benefit,
      recommendationLevel: article.recommendationLevel,
      membershipIds: article.memberships.map((m) => m.membership.id),
    });
    setEditingArticleId(article.id);
    setShowArticleForm(true);
  };

  const handleArticleDelete = async (id: string) => {
    if (!confirm('この記事を削除してもよろしいですか?')) return;

    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('記事を削除しました');
        fetchData();
      } else {
        toast.error('削除に失敗しました');
      }
    } catch (error) {
      console.error('記事削除エラー:', error);
      toast.error('削除に失敗しました');
    }
  };

  const resetArticleForm = () => {
    setArticleForm({
      title: '',
      noteLink: '',
      publishedAt: '',
      characterCount: 0,
      estimatedReadTime: 0,
      genre: '',
      targetAudience: '',
      benefit: '',
      recommendationLevel: '',
      membershipIds: [],
    });
    setEditingArticleId(null);
    setShowArticleForm(false);
  };

  // メンバーシップ操作
  const handleMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingMembershipId
        ? `/api/admin/memberships/${editingMembershipId}`
        : '/api/admin/memberships';
      const method = editingMembershipId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(membershipForm),
      });

      if (res.ok) {
        toast.success(
          editingMembershipId
            ? 'メンバーシップを更新しました'
            : 'メンバーシップを作成しました'
        );
        resetMembershipForm();
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || '操作に失敗しました');
      }
    } catch (error) {
      console.error('メンバーシップ操作エラー:', error);
      toast.error('操作に失敗しました');
    }
  };

  const handleMembershipEdit = (membership: Membership) => {
    setMembershipForm({
      name: membership.name,
      description: membership.description || '',
      color: membership.color || '#3B82F6',
      sortOrder: membership.sortOrder,
      isActive: membership.isActive,
    });
    setEditingMembershipId(membership.id);
    setShowMembershipForm(true);
  };

  const handleMembershipDelete = async (id: string) => {
    if (!confirm('このメンバーシップを削除してもよろしいですか?')) return;

    try {
      const res = await fetch(`/api/admin/memberships/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('メンバーシップを削除しました');
        fetchData();
      } else {
        toast.error('削除に失敗しました');
      }
    } catch (error) {
      console.error('メンバーシップ削除エラー:', error);
      toast.error('削除に失敗しました');
    }
  };

  const resetMembershipForm = () => {
    setMembershipForm({
      name: '',
      description: '',
      color: '#3B82F6',
      sortOrder: 0,
      isActive: true,
    });
    setEditingMembershipId(null);
    setShowMembershipForm(false);
  };

  // CSV一括登録
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('ファイルを選択してください');
      return;
    }

    setUploading(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/articles/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setImportResult(result);
        setSelectedFile(null);
        toast.success(`${result.imported}件の記事をインポートしました`);
        fetchData();
      } else {
        toast.error(`インポートに失敗しました: ${result.error}`);
      }
    } catch (error) {
      console.error('CSV アップロードエラー:', error);
      toast.error('CSVのアップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  // 認証されていない場合はログインフォームを表示
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">管理画面ログイン</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              ログイン
            </button>
          </form>

          <div className="mt-6 pt-6 border-t text-center text-sm text-gray-500">
            <p>開発環境パスワード: admin123</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">記事管理システム</h1>

        {/* タブ */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'articles'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            記事管理
          </button>
          <button
            onClick={() => setActiveTab('memberships')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'memberships'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            メンバーシップ管理
          </button>
        </div>

        {/* 記事管理タブ */}
        {activeTab === 'articles' && (
          <div>
            {/* CSV一括登録セクション */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-bold mb-4">CSV一括登録</h2>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="file-upload"
                      className="flex items-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      {selectedFile ? (
                        <p className="text-sm font-semibold text-blue-600">
                          {selectedFile.name}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600">
                          CSVファイルを選択（差分登録対応）
                        </p>
                      )}
                      <input
                        id="file-upload"
                        type="file"
                        accept=".csv"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {uploading ? 'アップロード中...' : 'アップロード'}
                  </button>
                </div>

                {importResult && (
                  <div className="bg-green-50 border-l-4 border-green-500 rounded p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <h3 className="font-bold text-green-800 mb-2">インポート完了</h3>
                        <div className="space-y-1 text-sm text-green-700">
                          <p>✅ {importResult.imported}件の記事を追加</p>
                          <p>⏭️ {importResult.skipped}件の記事をスキップ（重複）</p>
                        </div>
                        {importResult.errors && importResult.errors.length > 0 && (
                          <details className="mt-3">
                            <summary className="cursor-pointer text-red-600 font-semibold hover:underline">
                              ⚠️ エラー詳細 ({importResult.errors.length}件)
                            </summary>
                            <ul className="mt-2 space-y-1 text-xs text-red-600">
                              {importResult.errors.map((err: string, i: number) => (
                                <li key={i}>{err}</li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-2">📋 CSVフォーマット:</p>
                  <code className="text-xs block mb-2">
                    rowNumber,title,noteLink,publishedAt,characterCount,estimatedReadTime,genre,targetAudience,benefit,recommendationLevel,membershipIds
                  </code>
                  <p className="text-xs">
                    ※ membershipIdsはセミコロン区切り（例: id1;id2;id3）<br/>
                    ※ 既存のnoteLinkは自動的にスキップされます（差分登録）
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <button
                onClick={() => setShowArticleForm(!showArticleForm)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                {showArticleForm ? 'フォームを閉じる' : '新規記事作成'}
              </button>
            </div>

            {/* 記事フォーム */}
            {showArticleForm && (
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-bold mb-4">
                  {editingArticleId ? '記事編集' : '新規記事作成'}
                </h2>
                <form onSubmit={handleArticleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      タイトル *
                    </label>
                    <input
                      type="text"
                      value={articleForm.title}
                      onChange={(e) =>
                        setArticleForm({ ...articleForm, title: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      noteリンク *
                    </label>
                    <input
                      type="url"
                      value={articleForm.noteLink}
                      onChange={(e) =>
                        setArticleForm({ ...articleForm, noteLink: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        投稿日時 *
                      </label>
                      <input
                        type="date"
                        value={articleForm.publishedAt}
                        onChange={(e) =>
                          setArticleForm({
                            ...articleForm,
                            publishedAt: e.target.value,
                          })
                        }
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        文字数
                      </label>
                      <input
                        type="number"
                        value={articleForm.characterCount}
                        onChange={(e) =>
                          setArticleForm({
                            ...articleForm,
                            characterCount: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        推定読了時間（分）
                      </label>
                      <input
                        type="number"
                        value={articleForm.estimatedReadTime}
                        onChange={(e) =>
                          setArticleForm({
                            ...articleForm,
                            estimatedReadTime: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        ジャンル
                      </label>
                      <input
                        type="text"
                        value={articleForm.genre}
                        onChange={(e) =>
                          setArticleForm({ ...articleForm, genre: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      ユーザー層
                    </label>
                    <input
                      type="text"
                      value={articleForm.targetAudience}
                      onChange={(e) =>
                        setArticleForm({
                          ...articleForm,
                          targetAudience: e.target.value,
                        })
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      メリット
                    </label>
                    <textarea
                      value={articleForm.benefit}
                      onChange={(e) =>
                        setArticleForm({ ...articleForm, benefit: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      オススメ度
                    </label>
                    <input
                      type="text"
                      value={articleForm.recommendationLevel}
                      onChange={(e) =>
                        setArticleForm({
                          ...articleForm,
                          recommendationLevel: e.target.value,
                        })
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      メンバーシップ
                    </label>
                    <div className="space-y-2">
                      {memberships.map((membership) => (
                        <label
                          key={membership.id}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={articleForm.membershipIds.includes(
                              membership.id
                            )}
                            onChange={(e) => {
                              const ids = e.target.checked
                                ? [...articleForm.membershipIds, membership.id]
                                : articleForm.membershipIds.filter(
                                    (id) => id !== membership.id
                                  );
                              setArticleForm({
                                ...articleForm,
                                membershipIds: ids,
                              });
                            }}
                          />
                          <span
                            className="px-3 py-1 rounded text-sm"
                            style={{
                              backgroundColor: membership.color || '#3B82F6',
                              color: 'white',
                            }}
                          >
                            {membership.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                      {editingArticleId ? '更新' : '作成'}
                    </button>
                    <button
                      type="button"
                      onClick={resetArticleForm}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                    >
                      キャンセル
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 記事一覧 */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">タイトル</th>
                    <th className="px-4 py-3 text-left">投稿日</th>
                    <th className="px-4 py-3 text-left">ジャンル</th>
                    <th className="px-4 py-3 text-left">メンバーシップ</th>
                    <th className="px-4 py-3 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id} className="border-t">
                      <td className="px-4 py-3">
                        <a
                          href={article.noteLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {article.title}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="px-4 py-3">{article.genre}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
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
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleArticleEdit(article)}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            編集
                          </button>
                          <button
                            onClick={() => handleArticleDelete(article.id)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* メンバーシップ管理タブ */}
        {activeTab === 'memberships' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setShowMembershipForm(!showMembershipForm)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                {showMembershipForm ? 'フォームを閉じる' : '新規メンバーシップ作成'}
              </button>
            </div>

            {/* メンバーシップフォーム */}
            {showMembershipForm && (
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-bold mb-4">
                  {editingMembershipId
                    ? 'メンバーシップ編集'
                    : '新規メンバーシップ作成'}
                </h2>
                <form onSubmit={handleMembershipSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      メンバーシップ名 *
                    </label>
                    <input
                      type="text"
                      value={membershipForm.name}
                      onChange={(e) =>
                        setMembershipForm({
                          ...membershipForm,
                          name: e.target.value,
                        })
                      }
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">説明</label>
                    <textarea
                      value={membershipForm.description}
                      onChange={(e) =>
                        setMembershipForm({
                          ...membershipForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full border rounded px-3 py-2"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        カラー
                      </label>
                      <input
                        type="color"
                        value={membershipForm.color}
                        onChange={(e) =>
                          setMembershipForm({
                            ...membershipForm,
                            color: e.target.value,
                          })
                        }
                        className="w-full border rounded px-3 py-2 h-10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        表示順序
                      </label>
                      <input
                        type="number"
                        value={membershipForm.sortOrder}
                        onChange={(e) =>
                          setMembershipForm({
                            ...membershipForm,
                            sortOrder: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={membershipForm.isActive}
                        onChange={(e) =>
                          setMembershipForm({
                            ...membershipForm,
                            isActive: e.target.checked,
                          })
                        }
                      />
                      <span className="text-sm font-medium">有効</span>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                      {editingMembershipId ? '更新' : '作成'}
                    </button>
                    <button
                      type="button"
                      onClick={resetMembershipForm}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                    >
                      キャンセル
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* メンバーシップ一覧 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {memberships.map((membership) => (
                <div
                  key={membership.id}
                  className="bg-white p-6 rounded-lg shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="px-4 py-2 rounded text-white font-semibold"
                      style={{ backgroundColor: membership.color || '#3B82F6' }}
                    >
                      {membership.name}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        membership.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {membership.isActive ? '有効' : '無効'}
                    </span>
                  </div>

                  {membership.description && (
                    <p className="text-sm text-gray-600 mb-4">
                      {membership.description}
                    </p>
                  )}

                  <div className="text-sm text-gray-500 mb-4">
                    表示順序: {membership.sortOrder}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMembershipEdit(membership)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleMembershipDelete(membership.id)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
