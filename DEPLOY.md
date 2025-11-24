# Success Recipe Finder - デプロイガイド

このガイドでは、Success Recipe Finderを本番環境にデプロイする手順を説明します。

## 📋 デプロイ前の準備

### 1. GitHubリポジトリの作成

```bash
# リポジトリを初期化（まだの場合）
git init

# すべてのファイルを追加
git add .

# 初回コミット
git commit -m "Initial commit: Success Recipe Finder"

# GitHubにプッシュ
git remote add origin https://github.com/yourusername/success-recipe-finder.git
git branch -M main
git push -u origin main
```

### 2. 環境変数の準備

以下の環境変数が必要です：

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `DATABASE_URL` | データベース接続URL | `postgres://...` |
| `JWT_SECRET` | JWT認証用シークレット（32文字以上） | `openssl rand -base64 32` で生成 |
| `ADMIN_PASSWORD` | 管理者パスワード | 強力なパスワード |

## 🚀 Vercel へのデプロイ（推奨）

### 手順

#### 1. Vercelアカウント作成

[Vercel](https://vercel.com) にアクセスして、GitHubアカウントでサインアップ

#### 2. プロジェクトのインポート

1. Vercelダッシュボードで "Add New..." → "Project" をクリック
2. GitHubリポジトリを選択: `success-recipe-finder`
3. "Import" をクリック

#### 3. プロジェクト設定

**Framework Preset**: Next.js（自動検出）

**Root Directory**: `./` （変更不要）

**Build Command**: `npm run build` （デフォルト）

**Output Directory**: `.next` （デフォルト）

#### 4. 環境変数の設定

"Environment Variables" セクションで以下を追加：

```env
# データベース (Vercel Postgresを使用)
DATABASE_URL=postgres://default:...@...vercel-storage.com:5432/verceldb

# JWT Secret (ランダム生成)
JWT_SECRET=your-super-secret-32-plus-character-string-here

# 管理者パスワード
ADMIN_PASSWORD=your-secure-admin-password-123
```

**JWT_SECRETの生成方法**:
```bash
# ターミナルで実行
openssl rand -base64 32
```

または [Generate Secret](https://generate-secret.vercel.app/32) を使用

#### 5. データベースのセットアップ

**Vercel Postgresを使用する場合**:

1. Vercelダッシュボードの "Storage" タブをクリック
2. "Create Database" → "Postgres" を選択
3. データベース名を入力して作成
4. "Connect" ボタンから `DATABASE_URL` をコピー
5. プロジェクトの環境変数に `DATABASE_URL` を追加

**外部データベースを使用する場合**:
- [Supabase](https://supabase.com/)
- [PlanetScale](https://planetscale.com/)
- [Neon](https://neon.tech/)

などのPostgreSQLサービスを利用可能

#### 6. デプロイ実行

1. "Deploy" ボタンをクリック
2. ビルドが完了するまで待機（約2-3分）
3. デプロイ成功後、URLが発行されます

#### 7. データベースマイグレーション

デプロイ後、データベースを初期化：

```bash
# ローカルで実行
npx prisma migrate deploy --preview-feature

# または Vercel CLI を使用
vercel env pull .env.production
npx prisma migrate deploy
```

#### 8. 初期データの登録

1. デプロイされたURL + `/admin` にアクセス
2. 設定した `ADMIN_PASSWORD` でログイン
3. CSVファイルから記事をインポート

### Vercelの推奨設定

**vercel.json**（プロジェクトルートに配置）:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NODE_ENV": "production"
  }
}
```

## 🌲 Renderへのデプロイ

### 手順

1. [Render](https://render.com/) にアクセスしてサインアップ
2. "New +" → "Web Service" を選択
3. GitHubリポジトリを接続
4. 設定:
   ```
   Name: success-recipe-finder
   Environment: Node
   Build Command: npm install && npx prisma generate && npm run build
   Start Command: npm start
   ```
5. 環境変数を追加（Vercelと同様）
6. "Create Web Service" をクリック

## 🚂 Railwayへのデプロイ

### 手順

1. [Railway](https://railway.app/) にアクセスしてサインアップ
2. "New Project" → "Deploy from GitHub repo" を選択
3. `success-recipe-finder` リポジトリを選択
4. PostgreSQLデータベースを追加:
   - "Add Service" → "Database" → "PostgreSQL"
   - 自動的に `DATABASE_URL` が設定されます
5. 環境変数を追加:
   ```
   JWT_SECRET=...
   ADMIN_PASSWORD=...
   ```
6. デプロイが自動的に開始されます

## 🔒 セキュリティチェックリスト

デプロイ前に以下を確認：

- [ ] `JWT_SECRET` は32文字以上のランダム文字列
- [ ] `ADMIN_PASSWORD` は強力なパスワード（大文字・小文字・数字・記号を含む）
- [ ] `.env` ファイルが `.gitignore` に含まれている
- [ ] 本番環境で HTTPS が有効
- [ ] データベースへの接続がSSL/TLS暗号化されている
- [ ] 環境変数がVercel/Render/Railwayの管理画面で正しく設定されている

## 📊 本番環境の監視

### Vercel Analytics

Vercelダッシュボードで以下を確認：

- **Analytics**: ページビュー、ユニークユーザー数
- **Speed Insights**: パフォーマンスメトリクス
- **Logs**: エラーログとデバッグ情報

### カスタムドメインの設定

1. Vercelダッシュボードで "Settings" → "Domains"
2. カスタムドメインを追加（例: `success-recipe.example.com`）
3. DNSレコードを設定:
   ```
   Type: CNAME
   Name: success-recipe
   Value: cname.vercel-dns.com
   ```

## 🔄 継続的デプロイ（CD）

GitHubにプッシュすると自動的にデプロイされます：

```bash
# 変更をコミット
git add .
git commit -m "Update feature"
git push origin main

# Vercel/Render/Railwayが自動的にデプロイ
```

### プレビューデプロイ

プルリクエストごとにプレビュー環境が自動生成されます（Vercel）

## ⚠️ トラブルシューティング

### データベース接続エラー

```
Error: P1001: Can't reach database server
```

**解決策**:
- `DATABASE_URL` が正しく設定されているか確認
- データベースサーバーが起動しているか確認
- ファイアウォールの設定を確認

### ビルドエラー

```
Error: Cannot find module '@prisma/client'
```

**解決策**:
- Build Commandに `npx prisma generate` を追加
- `package.json` の `postinstall` スクリプトを確認

### 環境変数が反映されない

**解決策**:
- Vercel/Render/Railwayの管理画面で環境変数を再確認
- プロジェクトを再デプロイ（Redeploy）

## 📞 サポート

デプロイに関する問題がある場合：

1. [GitHub Issues](https://github.com/yourusername/success-recipe-finder/issues)
2. [Vercel Community](https://github.com/vercel/vercel/discussions)
3. [Railway Discord](https://discord.gg/railway)

---

**Happy Deploying! 🚀**
