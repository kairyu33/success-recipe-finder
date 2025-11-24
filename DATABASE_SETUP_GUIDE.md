# 🗄️ データベースセットアップガイド

## 📋 概要

Vercel Postgresデータベースを作成し、アプリケーションに接続します。

## 🚀 ステップ1: Vercel Postgres データベースを作成

### 1-1. Vercel Dashboardにアクセス

```
https://vercel.com/kairyu33s-projects/note-article-manager
```

### 1-2. Storageタブを開く

1. プロジェクトページの上部メニューから **"Storage"** をクリック
2. **"Create Database"** ボタンをクリック

### 1-3. Postgres を選択

1. データベースタイプから **"Postgres"** を選択
2. データベース名を入力（例: `note-article-db`）
3. リージョンを選択（推奨: **Tokyo (hnd1)**）
4. **"Create"** をクリック

### 1-4. データベースが作成されるまで待つ

作成には約30〜60秒かかります。

## 🔧 ステップ2: 環境変数の自動設定

### 2-1. データベースをプロジェクトに接続

1. 作成したデータベースのページで **"Connect Project"** をクリック
2. **"note-article-manager"** プロジェクトを選択
3. Environment: **"Production"** を選択
4. **"Connect"** をクリック

### 2-2. 環境変数が自動設定されます

以下の環境変数が自動的に追加されます：
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NO_SSL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

## ✅ ステップ3: 環境変数を確認・追加

### 3-1. 環境変数ページを開く

```
https://vercel.com/kairyu33s-projects/note-article-manager/settings/environment-variables
```

### 3-2. DATABASE_URL を追加

**重要**: PrismaはデフォルトでDATABASE_URLを使用します。

1. **"Add New"** をクリック
2. Key: `DATABASE_URL`
3. Value: `POSTGRES_PRISMA_URL`の値をコピー（または以下の形式）
   ```
   postgresql://[user]:[password]@[host]/[database]?sslmode=require&pgbouncer=true
   ```
4. Environment: **Production** にチェック
5. **"Save"** をクリック

### 3-3. その他の必要な環境変数を追加

#### JWT_SECRET

1. Key: `JWT_SECRET`
2. Value: 以下のコマンドで生成
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   または任意の32文字以上の文字列
3. Environment: **Production**
4. Save

#### MEMBERSHIP_PASSWORD

1. Key: `MEMBERSHIP_PASSWORD`
2. Value: 管理画面のパスワード（8文字以上推奨）
   例: `SecurePass2024!`
3. Environment: **Production**
4. Save

#### ANTHROPIC_API_KEY (オプション)

AI機能を使用する場合：
1. Key: `ANTHROPIC_API_KEY`
2. Value: AnthropicのAPIキー
3. Environment: **Production**
4. Save

## 🚀 ステップ4: デプロイして初期化

### 4-1. 再デプロイをトリガー

環境変数を設定後、再デプロイが必要です。

**方法1: Dashboard から**
1. Deploymentsタブ
2. 最新デプロイの **"..."** メニュー
3. **"Redeploy"** をクリック

**方法2: Git Push から**
```bash
cd note-article-manager
git commit --allow-empty -m "chore: Trigger redeploy for database setup"
git push origin main
```

### 4-2. ビルドログを確認

以下が表示されることを確認：
```
✓ Prisma schema loaded
✓ Database schema synchronized (prisma db push)
✓ Build completed successfully
```

## ✅ ステップ5: 動作確認

### 5-1. 管理画面にアクセス

```
https://note-article-manager-oihn8knf2-kairyu33s-projects.vercel.app/admin
```

### 5-2. ログイン

設定した`MEMBERSHIP_PASSWORD`でログイン

### 5-3. 動作確認

- 記事一覧が表示される（空の場合もOK）
- データベースエラーが出ないこと
- CSV登録ができること

## 🔍 トラブルシューティング

### エラー: "Can't reach database server"

**原因**: DATABASE_URLが正しくない

**解決策**:
1. Vercel Dashboard → Settings → Environment Variables
2. `DATABASE_URL`の値を確認
3. `POSTGRES_PRISMA_URL`の値と一致しているか確認
4. 再デプロイ

### エラー: "Connection pool timeout"

**原因**: 接続プールの設定

**解決策**:
DATABASE_URLに`pgbouncer=true`パラメータを追加：
```
postgresql://...?sslmode=require&pgbouncer=true
```

### エラー: "Schema not synced"

**原因**: データベースにテーブルが作成されていない

**解決策**:
ビルドログで`prisma db push`が成功しているか確認。
失敗している場合はログを確認して修正。

## 📝 環境変数チェックリスト

デプロイ前に以下を確認：

- [ ] `DATABASE_URL` - PostgreSQL接続URL（pgbouncer=true付き）
- [ ] `JWT_SECRET` - 32文字以上のランダム文字列
- [ ] `MEMBERSHIP_PASSWORD` - 管理画面パスワード（8文字以上）
- [ ] すべて **Production** 環境に設定済み
- [ ] Vercel Postgres データベースがプロジェクトに接続済み

## 🎉 完了！

これでデータベースのセットアップが完了です。

問題が発生した場合：
1. Vercel Logs を確認: https://vercel.com/kairyu33s-projects/note-article-manager/logs
2. エラーメッセージをメモ
3. 上記のトラブルシューティングを参照
