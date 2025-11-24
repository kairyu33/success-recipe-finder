/**
 * CSVアップロードコンポーネント
 */

'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { importArticlesFromCSV } from '@/lib/api';
import { MESSAGES } from '@/lib/constants';
import type { ImportResult } from '@/types';

type CSVUploadProps = {
  onSuccess: () => void;
};

export function CSVUpload({ onSuccess }: CSVUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error(MESSAGES.ERROR.FILE_NOT_SELECTED);
      return;
    }

    setUploading(true);
    setImportResult(null);

    try {
      const result = await importArticlesFromCSV(selectedFile);
      setImportResult(result);
      setSelectedFile(null);
      toast.success(MESSAGES.SUCCESS.CSV_IMPORTED(result.imported));
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : MESSAGES.ERROR.OPERATION_FAILED;
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
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
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
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
                      {importResult.errors.map((err, i) => (
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
            ※ membershipIdsはセミコロン区切り（例: id1;id2;id3）
            <br />※ 既存のnoteLinkは自動的にスキップされます（差分登録）
          </p>
        </div>
      </div>
    </div>
  );
}
