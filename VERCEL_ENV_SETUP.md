# 🔧 Vercel環境変数設定ガイド

## 問題の原因

本番環境で環境変数が正しく反映されていないため、以下の問題が発生しています：
1. 管理画面が `admin123` でログインできてしまう（環境変数が読み込まれていない）
2. **データベース接続エラーでCSV登録ができない（主な問題）**
3. Prismaマイグレーションがビルド時に実行されていない

## 🔧 修正内容（既に適用済み）

1. **ビルドスクリプトにマイグレーション追加**: `package.json`の`build`スクリプトを更新して、ビルド前にデータベースマイグレーションを実行するようにしました。

## ✅ 解決手順

### Step 1: Vercel Dashboardで環境変数を設定

1. **Vercel Dashboardにアクセス**
   ```
   https://vercel.com/kairyu33s-projects/note-article-manager/settings/environment-variables
   ```

2. **既存の環境変数を確認**

   以下の環境変数が **Production** 環境に設定されていることを確認：
   - `DATABASE_URL`
   - `POSTGRES_URL`
   - `PRISMA_DATABASE_URL`
   - `JWT_SECRET`
   - `MEMBERSHIP_PASSWORD`

3. **不足している環境変数を追加**

   #### JWT_SECRETの追加（なければ）

   - **Key**: `JWT_SECRET`
   - **Value**:
     ```
     4DehrZS9Espm46QVCz1xgGbM62UMfVgQC37CZMnLt5A=
     ```
   - **Environment**: **Production** にチェック
   - 「Save」をクリック

   #### MEMBERSHIP_PASSWORDの確認・更新

   - **Key**: `MEMBERSHIP_PASSWORD`
   - **Value**: `kairyu330315` （または任意の強力なパスワード）
   - **Environment**: **Production** にチェック
   - 「Save」をクリック

### Step 2: 環境変数の値を確認

Vercel Dashboardで各環境変数をクリックし、以下を確認：
- ✅ **Production** 環境にチェックが入っているか
- ✅ 値が正しく設定されているか

### Step 3: 本番環境を再デプロイ

#### 方法1: Vercel Dashboard（推奨）

1. **Deploymentsタブ**に移動
   ```
   https://vercel.com/kairyu33s-projects/note-article-manager
   ```

2. 最新のデプロイメントの **「...」メニュー** をクリック

3. **「Redeploy」** を選択

4. 確認ダイアログで **「Redeploy」** をクリック

#### 方法2: Git Push

```bash
cd note-article-manager
git commit --allow-empty -m "redeploy: Apply environment variables"
git push origin main
```

### Step 4: デプロイ完了を待つ

デプロイが完了するまで待機（通常30〜60秒）

### Step 5: 動作確認

1. **管理画面にアクセス**
   ```
   https://note-article-manager-[latest-deployment-id].vercel.app/admin
   ```

2. **ログインテスト**
   - パスワード: `kairyu330315` （設定した値）
   - `admin123` ではログインできないことを確認

3. **CSV登録テスト**
   - 管理画面にログイン後、「CSV一括アップロード」タブ
   - テストCSVをアップロード
   - データベースエラーが出ないことを確認

---

## 🔍 トラブルシューティング

### 問題1: 環境変数が反映されない

**原因**: デプロイ時に環境変数が読み込まれていない

**解決策**:
1. Vercel Dashboardで環境変数の **Environment** が **Production** になっているか確認
2. ブラウザのキャッシュをクリア（Ctrl + Shift + R）
3. 新しいデプロイURLにアクセス（最新のデプロイメントURLを確認）

### 問題2: データベース接続エラー

**エラーメッセージ**:
```
P1001: Can't reach database server
```

**解決策**:

#### A. DATABASE_URLを確認

```bash
cd note-article-manager
npx vercel env pull .env.production.check
cat .env.production.check | grep DATABASE_URL
```

正しい形式:
```
DATABASE_URL="postgres://[user]:[password]@db.prisma.io:5432/postgres?sslmode=require"
```

#### B. Vercel Postgresデータベースの確認

1. Vercel Dashboard → **Storage** タブ
2. データベースが作成されているか確認
3. **Settings** → **Environment Variables** で `DATABASE_URL` が自動設定されているか確認

#### C. データベース接続テスト

```bash
cd note-article-manager

# 本番環境変数を取得
npx vercel env pull .env.production.test

# Prisma接続テスト
DATABASE_URL="$(grep DATABASE_URL .env.production.test | cut -d '=' -f2 | tr -d '"')" \
npx prisma db pull --schema prisma/schema.prisma
```

成功すれば接続OK、失敗すれば `DATABASE_URL` の値を確認

### 問題3: CSVアップロードエラー

**エラーメッセージ**:
```
データ取得エラー / CSV処理エラー
```

**解決策**:

1. **ブラウザのコンソールを確認**
   - F12キー → Console タブ
   - 赤いエラーメッセージを確認

2. **APIエンドポイントの確認**
   ```bash
   curl -X POST https://[deployment-url]/api/admin/articles \
     -H "Content-Type: application/json" \
     -d '{"title":"test"}'
   ```

3. **Vercel Logsを確認**
   - Vercel Dashboard → **Logs** タブ
   - リアルタイムエラーを確認

---

## 📋 環境変数チェックリスト

デプロイ前に以下を確認：

- [ ] `DATABASE_URL` が **Production** 環境に設定されている
- [ ] `POSTGRES_URL` が **Production** 環境に設定されている
- [ ] `PRISMA_DATABASE_URL` が **Production** 環境に設定されている
- [ ] `JWT_SECRET` が **Production** 環境に設定されている（32文字以上）
- [ ] `MEMBERSHIP_PASSWORD` が **Production** 環境に設定されている（8文字以上）
- [ ] 各環境変数の値が正しい（空欄でない、スペースが入っていない）
- [ ] 再デプロイを実行した
- [ ] 最新のデプロイメントURLで動作確認した

---

## 🚀 完了後の動作確認

### 1. 管理画面ログイン
```
URL: https://[latest-deployment-url]/admin
パスワード: kairyu330315
```

### 2. CSV登録テスト
1. 管理画面にログイン
2. 「CSV一括アップロード」タブ
3. 以下の内容でCSVを作成してアップロード:

```csv
title,noteLink,publishedAt,characterCount,estimatedReadTime,genre,targetAudience,benefit,recommendationLevel
テスト記事,https://note.com/test,2025-11-24,3000,10,ビジネス,起業家,成功への道筋,⭐⭐⭐⭐⭐
```

4. 「記事管理」タブで新しい記事が追加されていることを確認

---

## 📞 サポート

問題が解決しない場合：

1. **Vercel Logs確認**
   ```
   https://vercel.com/kairyu33s-projects/note-article-manager/logs
   ```

2. **環境変数一覧出力**
   ```bash
   npx vercel env ls production > env-check.txt
   ```

3. **デプロイメントURLの確認**
   ```bash
   npx vercel ls
   ```

最新のデプロイメントURLでテストしてください。
