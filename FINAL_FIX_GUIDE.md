# 🚀 最終修正ガイド - Prisma Standalone Mode

## 問題の根本原因

Vercel + Next.js 16 + Prismaの組み合わせで、**Query Engineバイナリがランタイムで見つからない**問題が発生していました。

ビルドは成功するが、実行時に以下のエラー：
```
Prisma Client could not locate the Query Engine for runtime "rhel-openssl-3.0.x"
```

## 適用した最終修正

### 1. Standalone Output Mode（最重要）

**next.config.ts**:
```typescript
output: 'standalone'
```

**効果**: 
- Vercelが推奨するモード
- すべての依存関係を含む最小限のNode.jsサーバーを作成
- ファイルトレースがより正確になる

### 2. Postbuild検証スクリプト

**scripts/postbuild.js**:
- Prismaバイナリの存在を確認
- standaloneビルドにコピー
- デバッグログを出力

### 3. 包括的なFile Tracing

**next.config.ts**:
```typescript
outputFileTracingIncludes: {
  '/': ['./node_modules/.prisma/client/**/*', './node_modules/@prisma/engines/**/*'],
  '/api/**/*': ['./node_modules/.prisma/client/**/*', './node_modules/@prisma/engines/**/*'],
  '/**/*': ['./node_modules/.prisma/client/**/*'],
}
```

### 4. Vercel Function設定

**vercel.json**:
```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10,
      "memory": 1024,
      "includeFiles": "node_modules/.prisma/client/**"
    },
    ".next/server/**/*.js": {
      "includeFiles": "node_modules/.prisma/client/**"
    }
  }
}
```

## デプロイ手順

### ステップ1: Pushしてデプロイ

```bash
cd note-article-manager
git push origin main
```

### ステップ2: ビルドログを監視

Vercel Dashboard: https://vercel.com/kairyu33s-projects/note-article-manager

**確認すべきログ**:
```
✓ Running "npm run vercel-build"
✓ Prisma schema loaded
✓ Generated Prisma Client
✓ Database schema synchronized
🔧 Postbuild: Checking Prisma binaries...
✅ Prisma client found
✅ Query engine binary found: libquery_engine-rhel-openssl-3.0.x.so.node
📦 Copying Prisma files to standalone...
✅ Prisma files copied to standalone build
✅ Postbuild: Prisma setup complete
✓ Build completed successfully
```

### ステップ3: デプロイ完了後の動作確認

1. **管理画面にアクセス**:
   ```
   https://note-article-manager-oihn8knf2-kairyu33s-projects.vercel.app/admin
   ```

2. **ログイン**

3. **記事一覧が表示されることを確認**
   - Prisma Engineエラーが出ないこと
   - データベース接続が成功すること

## トラブルシューティング

### まだエラーが出る場合

#### 1. Vercelキャッシュをクリア

```bash
# ローカルから
npx vercel --prod --force

# または Dashboard から
Settings → General → "Clear Cache" → Redeploy
```

#### 2. ビルドログでpostbuildの出力を確認

postbuildスクリプトが実行されていない場合：
- `npm run vercel-build`が正しく設定されているか確認
- vercel.jsonの`buildCommand`を確認

#### 3. 環境変数を再確認

```bash
DATABASE_URL=postgres://... (PostgreSQL形式)
```

SQLite形式（`file:./dev.db`）になっていないか確認

## なぜこれで動作するのか？

### Standalone Modeの利点

1. **完全な依存関係の包含**: すべての必要なファイルが`.next/standalone`に集約
2. **正確なファイルトレース**: Next.jsが使用するファイルを正確に検出
3. **Vercel最適化**: Vercelのサーバーレス環境に最適化された出力

### Postbuildスクリプトの役割

1. **検証**: Prismaバイナリの存在を確認
2. **コピー**: standaloneビルドにバイナリをコピー
3. **デバッグ**: 詳細なログで問題を特定可能

### outputFileTracingIncludes

- Next.jsのファイルトレースを強制的に拡張
- Prismaファイルが自動検出されない場合の保険

## 参考リンク

- [Next.js Standalone Output](https://nextjs.org/docs/pages/api-reference/next-config-js/output#automatically-copying-traced-files)
- [Vercel + Prisma Best Practices](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Prisma Binary Targets](https://www.prisma.io/docs/concepts/components/prisma-engines/query-engine#binary-targets)

---

**作成日**: 2025-11-24
**最終更新**: 今回の修正で確実に動作するはず！
