# 🚀 Vercelへのデプロイガイド - Success Recipe Finder

## ✅ 完了したこと

### 1. データ保護
- ✅ **571記事**のデータを安全にバックアップ済み
- ✅ バックアップファイル: `backups/backup-2025-11-24T03-40-21-693Z.json`
- ✅ データ復元スクリプト作成済み: `scripts/restore-data.ts`

### 2. GitHubリポジトリ
- ✅ リポジトリ作成完了
- ✅ URL: **https://github.com/kairyu33/success-recipe-finder**
- ✅ 285ファイル、80,173行をプッシュ済み

## 📋 Vercelデプロイ手順

### 方法1: Vercel Dashboard（推奨）

#### Step 1: Vercelにログイン
1. **https://vercel.com** にアクセス
2. 「Sign Up」または「Login」
3. GitHubアカウントで認証

#### Step 2: プロジェクトをインポート
1. Vercel Dashboardで「Add New...」→「Project」をクリック
2. **success-recipe-finder** リポジトリを選択
3. 「Import」をクリック

#### Step 3: プロジェクト設定

**Framework Preset**: Next.js（自動検出）
**Root Directory**: `./` （デフォルト）

#### Step 4: 環境変数を設定（重要！）

「Environment Variables」セクションで以下を追加：

```env
# 1. JWT Secret（必須）
# コマンドで生成: openssl rand -base64 32
JWT_SECRET=PASTE_YOUR_GENERATED_SECRET_HERE

# 2. 管理者パスワード（必須）
# 12文字以上、大文字・小文字・数字・記号を含む
ADMIN_PASSWORD=YourSecure$Password2025!

# 3. データベースURL（後で設定）
# まずは空のPostgreSQLデータベースを使用
DATABASE_URL=postgresql://...
```

**JWT_SECRETの生成方法:**
```bash
# Windowsの場合（WSL使用）
wsl openssl rand -base64 32

# または https://generate-secret.vercel.app/32 を使用
```

#### Step 5: デプロイ実行
1. 「Deploy」ボタンをクリック
2. ビルドが完了するまで待機（2-3分）
3. デプロイURLが発行されます

### 方法2: Vercel CLI

```bash
# Vercelにログイン
npx vercel login

# プロジェクトをリンク
npx vercel link

# 環境変数を設定
npx vercel env add JWT_SECRET
# → 生成したJWTシークレットを貼り付け

npx vercel env add ADMIN_PASSWORD
# → 管理者パスワードを入力

# 本番デプロイ
npx vercel --prod
```

## 📊 データベースセットアップ

### Option 1: Vercel Postgres（推奨）

#### 1. データベースを作成
1. Vercel Dashboard → 「Storage」タブ
2. 「Create Database」→「Postgres」を選択
3. データベース名: `success-recipe-db`
4. リージョン: Tokyo (hnd1)を選択
5. 「Create」をクリック

#### 2. DATABASE_URLを取得
1. 作成したデータベースをクリック
2. 「Connect」タブで `.env.local` を選択
3. `DATABASE_URL` をコピー

#### 3. 環境変数に追加
1. プロジェクトSettings → Environment Variables
2. `DATABASE_URL` を追加
3. コピーしたURLを貼り付け
4. 「Save」をクリック

#### 4. プロジェクトを再デプロイ
- Dashboard → Deployments → 最新のデプロイ → 「...」→「Redeploy」

### Option 2: Supabase/Neon（無料プラン利用）

**Supabase:**
1. https://supabase.com でプロジェクト作成
2. Settings → Database → Connection String (URI) をコピー
3. Vercelの環境変数に `DATABASE_URL` として追加

**Neon:**
1. https://neon.tech でプロジェクト作成
2. Connection String をコピー
3. Vercelの環境変数に追加

## 🔄 データ移行手順

デプロイ後、571記事のデータを本番環境に移行します：

### Step 1: Vercelプロジェクトをローカルにリンク

```bash
cd note-article-manager
npx vercel link
```

### Step 2: 本番環境変数を取得

```bash
npx vercel env pull .env.production
```

### Step 3: データベースマイグレーション実行

```bash
# Prisma migrationsを実行
npx prisma migrate deploy

# または、直接DATABASE_URLを指定
DATABASE_URL="your_production_url" npx prisma migrate deploy
```

### Step 4: データを復元

```bash
# バックアップから本番環境にデータをインポート
FORCE_RESTORE=true npx tsx scripts/restore-data.ts

# 進捗が表示されます:
# 📥 データベース復元を開始します...
# 📄 使用するバックアップ: backup-2025-11-24T03-40-21-693Z.json
# 📊 バックアップ情報:
#    - 作成日時: 2025-11-24T03:40:21.693Z
#    - 記事数: 571
# 🔄 データを復元しています...
#    進捗: 50/571
#    進捗: 100/571
#    ...
#    ✅ 571件の記事を復元
# ✅ データベース復元が完了しました!
```

## ✅ デプロイ後の確認

### 1. サイトにアクセス
デプロイURL: `https://your-project.vercel.app`

### 2. 記事ページを確認
```
https://your-project.vercel.app/articles
```
→ 571記事が表示されることを確認

### 3. 管理画面にログイン
```
https://your-project.vercel.app/admin
```
→ 設定したADMIN_PASSWORDでログイン

### 4. セキュリティヘッダーを確認
```bash
curl -I https://your-project.vercel.app

# 以下のヘッダーが表示されることを確認:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Strict-Transport-Security: max-age=63072000
# Content-Security-Policy: ...
```

## 🎯 公開URL

デプロイ完了後、以下のURLで公開されます：

```
本番URL: https://success-recipe-finder.vercel.app
または
カスタムドメイン: https://your-domain.com
```

## 📝 カスタムドメインの設定（オプション）

### Vercel Dashboardで設定

1. プロジェクトSettings → Domains
2. 「Add」をクリック
3. ドメイン名を入力（例: `recipe.example.com`）
4. DNSレコードを設定:

```
Type: CNAME
Name: recipe (またはサブドメイン名)
Value: cname.vercel-dns.com
```

5. DNS設定が反映されるまで待機（最大48時間、通常は数分）

## 🔐 セキュリティチェックリスト

デプロイ前に確認：

- [ ] `JWT_SECRET` は32文字以上のランダム文字列
- [ ] `ADMIN_PASSWORD` は12文字以上で複雑なパスワード
- [ ] `DATABASE_URL` は本番用のPostgreSQLデータベース
- [ ] `.env` ファイルがGitHubにプッシュされていない（`.gitignore`で除外済み）
- [ ] バックアップファイルがローカルに保存されている

## 📊 デプロイ後のモニタリング

### Vercel Analytics

1. プロジェクトDashboard → Analytics
2. 以下を確認:
   - ページビュー数
   - ユニークユーザー数
   - トラフィックの国別分布

### Vercel Logs

1. Dashboard → Logs
2. エラーやwarningがないか確認
3. API呼び出しの成功/失敗を監視

## ⚠️ トラブルシューティング

### ビルドが失敗する

**エラー**: `Cannot find module '@prisma/client'`

**解決策**:
```json
// package.json の postinstall スクリプトを確認
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### データベース接続エラー

**エラー**: `P1001: Can't reach database server`

**解決策**:
1. `DATABASE_URL` が正しく設定されているか確認
2. データベースサーバーが起動しているか確認
3. IPホワイトリストの設定を確認（Vercelは自動許可）

### 記事が表示されない

**解決策**:
1. データベースマイグレーションが完了しているか確認
2. データ復元スクリプトを実行
3. Vercel Logsでエラーを確認

## 🎉 完了！

デプロイが成功したら：

1. ✅ 571記事が公開URL `https://success-recipe-finder.vercel.app/articles` で閲覧可能
2. ✅ 第三者がアクセス可能
3. ✅ 検索・フィルター機能が動作
4. ✅ モバイル対応完了
5. ✅ セキュアな管理画面

---

**デプロイ実施日**: 2025-11-24
**GitHubリポジトリ**: https://github.com/kairyu33/success-recipe-finder
**データバックアップ**: ✅ 571記事
**ステータス**: 🟢 デプロイ準備完了
