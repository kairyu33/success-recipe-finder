# 🔧 Prisma Deployment Fix - 完全版

## 問題の概要

Vercelデプロイ時に以下のエラーが発生していました：
```
Prisma Client could not locate the Query Engine for runtime "rhel-openssl-3.0.x"
```

## 根本原因

1. **ビルドプロセスの問題**: `postinstall`スクリプトがVercelのキャッシュにより実行されない
2. **バイナリの欠如**: Prisma Query Engineバイナリがデプロイに含まれていない
3. **ファイルトレースの設定不足**: Next.jsがPrismaファイルを検出できていない

## 適用した修正

### 1. `package.json` - vercel-buildスクリプト追加

```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

**理由**: Vercelは`vercel-build`スクリプトを優先的に実行します。これにより、`prisma generate`が確実にビルド前に実行されます。

### 2. `vercel.json` - ビルドコマンドと関数設定

```json
{
  "buildCommand": "npm run vercel-build",
  "functions": {
    "app/api/**/*.ts": {
      "includeFiles": "node_modules/.prisma/client/**"
    }
  }
}
```

**理由**: 
- `buildCommand`で確実に`vercel-build`を実行
- `includeFiles`でPrisma Clientファイルを明示的に含める

### 3. `next.config.ts` - outputFileTracing設定

```typescript
{
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/.prisma/client/**/*'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/engines'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), '@prisma/client', '@prisma/engines'];
    }
    return config;
  }
}
```

**理由**:
- `outputFileTracingIncludes`: Next.jsにPrismaファイルを含めるよう指示
- `serverComponentsExternalPackages`: Prismaをバンドリングから除外
- `webpack externals`: サーバーサイドでPrismaを正しく扱う

### 4. `prisma/schema.prisma` - binaryTargets設定

```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}
```

**理由**: Vercel環境（RHEL Linux）用のQuery Engineバイナリを生成

### 5. `.vercelignore` - ファイル除外の防止

```
!node_modules/.prisma/client
!prisma
```

**理由**: Prismaファイルが誤って除外されないようにする

## デプロイ手順

### ステップ1: 変更をプッシュ

```bash
cd note-article-manager
git push origin main
```

### ステップ2: デプロイを監視

Vercel Dashboardでデプロイログを確認：
```
https://vercel.com/kairyu33s-projects/note-article-manager
```

以下のログが表示されることを確認：
```
✓ Running "npm run vercel-build"
✓ Prisma schema loaded from prisma/schema.prisma
✓ Generated Prisma Client
✓ Migrations deployed
```

### ステップ3: 動作確認

デプロイ完了後（1〜2分）:

1. **管理画面にアクセス**
   ```
   https://note-article-manager-oihn8knf2-kairyu33s-projects.vercel.app/admin
   ```

2. **ログイン**
   - パスワードを入力

3. **記事一覧の表示を確認**
   - エラーが表示されないことを確認
   - 記事データが正常に読み込まれることを確認

## トラブルシューティング

### まだエラーが出る場合

#### 1. Vercelキャッシュをクリア

```bash
# Vercel CLIを使用
vercel env pull
vercel --prod --force
```

または、Vercel Dashboardから：
1. Settings → General
2. "Clear Cache" をクリック
3. 再デプロイ

#### 2. 環境変数を確認

必要な環境変数がProductionに設定されているか確認：
- `DATABASE_URL`
- `JWT_SECRET`
- `MEMBERSHIP_PASSWORD`

#### 3. ビルドログを確認

Vercel Dashboard → Deployments → 最新デプロイ → Build Logs

以下を確認：
- ✅ `prisma generate` が実行されているか
- ✅ `prisma migrate deploy` が成功しているか
- ✅ エラーメッセージがないか

## 技術的な詳細

### なぜこれが必要なのか？

1. **Vercelの仕組み**:
   - Vercelはビルド時にnode_modulesをキャッシュ
   - `postinstall`が実行されない場合がある
   - Next.jsの出力最適化でPrismaファイルが除外される

2. **Prismaの仕組み**:
   - Query Engineは環境ごとに異なるバイナリが必要
   - ローカル: `darwin-arm64` (Mac) / `windows` etc.
   - Vercel: `rhel-openssl-3.0.x` (Red Hat Linux)

3. **解決策の仕組み**:
   - `vercel-build`で確実に`prisma generate`を実行
   - `binaryTargets`で複数環境のバイナリを生成
   - `outputFileTracingIncludes`でデプロイに含める
   - `includeFiles`で確実にコピー

## 参考リンク

- [Prisma + Next.js (Vercel) デプロイガイド](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Vercel Output File Tracing](https://nextjs.org/docs/app/api-reference/next-config-js/output#automatically-copying-traced-files)
- [Prisma Binary Targets](https://www.prisma.io/docs/concepts/components/prisma-engines/query-engine#binary-targets)

---

**作成日**: 2025-11-24
**適用済み**: ✅ すべての修正がコミット済み
