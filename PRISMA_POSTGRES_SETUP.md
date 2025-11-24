# 🚀 Prisma Postgres セットアップガイド

## 現状確認

既に **Prisma Postgres** データベース `success-recipe-db` が存在しています。
これを使用します！

## ✅ ステップ1: データベース接続情報を確認

### 1-1. Vercel Storage ページを開く

```
https://vercel.com/kairyu33s-projects/storage
```

### 1-2. success-recipe-db をクリック

データベースの詳細ページが開きます。

### 1-3. 接続情報をメモ

以下の情報が表示されているはずです：
- **PRISMA_DATABASE_URL** (Accelerate経由 - 推奨)
- **POSTGRES_PRISMA_URL** (直接接続)
- **POSTGRES_URL**
- その他の接続情報

## 🔧 ステップ2: 環境変数を設定

### 2-1. 環境変数ページを開く

```
https://vercel.com/kairyu33s-projects/note-article-manager/settings/environment-variables
```

### 2-2. 既存の環境変数を確認

以下の環境変数が**Production**に設定されているか確認：

#### ✅ 必須の環境変数

**DATABASE_URL** - 最重要！
- Key: `DATABASE_URL`
- Value: データベースページの`POSTGRES_PRISMA_URL`の値
- 形式例:
  ```
  postgresql://user:password@host/database?sslmode=require&pgbouncer=true
  ```
- Environment: **Production** にチェック

**または** Accelerate を使用する場合:
- Key: `DATABASE_URL`
- Value: `PRISMA_DATABASE_URL`の値
- 形式例:
  ```
  prisma+postgres://accelerate.prisma-data.net/?api_key=...
  ```

#### その他の必要な環境変数

**JWT_SECRET**
```bash
# 生成コマンド
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**MEMBERSHIP_PASSWORD**
```
管理画面のパスワード（8文字以上推奨）
例: SecurePass2024!
```

### 2-3. 環境変数が存在しない場合は追加

1. **"Add New"** をクリック
2. Key, Value, Environment を設定
3. **"Save"**

### 2-4. 既存の環境変数を編集する場合

1. 環境変数の右側の **"..."** メニューをクリック
2. **"Edit"** を選択
3. 値を更新
4. **"Save"**

## 🗑️ ステップ3: 古い環境変数を削除（オプション）

以下の環境変数が重複している場合は削除：
- `POSTGRES_URL` (DATABASE_URLと重複)
- 古い`DATABASE_URL` (SQLite形式のもの)

**重要**: `DATABASE_URL`は**必ず1つだけ**存在すること

## 🚀 ステップ4: データベーススキーマを初期化

### 4-1. プロジェクトがデータベースに接続されているか確認

1. Storageページ → `success-recipe-db` をクリック
2. **"Connected Projects"** セクションを確認
3. `note-article-manager`が表示されていない場合:
   - **"Connect Project"** をクリック
   - `note-article-manager`を選択
   - Environment: **Production**
   - **"Connect"**

### 4-2. 再デプロイ

**方法A: Vercel Dashboard**
1. https://vercel.com/kairyu33s-projects/note-article-manager
2. **Deployments** タブ
3. 最新デプロイの **"..."** → **"Redeploy"**

**方法B: Git Push**
```bash
cd note-article-manager
git commit --allow-empty -m "chore: Trigger redeploy with Prisma Postgres"
git push origin main
```

### 4-3. ビルドログを確認

以下が表示されることを確認：
```
✓ Running "npm run vercel-build"
✓ Prisma schema loaded from prisma/schema.prisma
✓ Generated Prisma Client (v6.18.0)
✓ Database schema synchronized
✓ Build completed successfully
```

エラーが出る場合は、ログの内容をメモしてください。

## ✅ ステップ5: 動作確認

### 5-1. 管理画面にアクセス

```
https://note-article-manager-oihn8knf2-kairyu33s-projects.vercel.app/admin
```

### 5-2. ログイン

設定した`MEMBERSHIP_PASSWORD`でログイン

### 5-3. 動作確認

- [ ] 記事一覧が表示される（空でもOK）
- [ ] データベースエラーが出ない
- [ ] Prisma Engineエラーが出ない

## 🔍 トラブルシューティング

### エラー: "Can't reach database server"

**原因**: DATABASE_URLが間違っている

**確認ポイント**:
1. DATABASE_URLの値を確認
2. Storageページの接続URLと一致しているか
3. `sslmode=require`が含まれているか
4. Accelerate使用の場合、APIキーが正しいか

**解決策**:
```bash
# Storageページで正しいURLをコピー
# Environment Variablesで更新
# 再デプロイ
```

### エラー: "Prisma Client could not locate Query Engine"

**原因**: Prismaバイナリの問題（既に修正済みのはず）

**確認**: 
ビルドログで以下が表示されているか確認:
```
✅ Query engine binary found: libquery_engine-rhel-openssl-3.0.x.so.node
```

表示されていない場合は、キャッシュをクリアして再デプロイ。

### データベースをリセットしたい場合

**警告**: 全データが削除されます！

1. Storageページ → `success-recipe-db`
2. **Settings** タブ
3. **"Delete Database"** （慎重に！）
4. 新しいデータベースを作成（ステップ1から）

## 📋 環境変数チェックリスト

デプロイ前に確認：

- [ ] `DATABASE_URL` = Prisma PostgresのURL（POSTGRES_PRISMA_URLまたはPRISMA_DATABASE_URL）
- [ ] `JWT_SECRET` = 32文字以上のランダム文字列
- [ ] `MEMBERSHIP_PASSWORD` = 管理画面パスワード
- [ ] すべて **Production** 環境に設定済み
- [ ] `success-recipe-db`がプロジェクトに接続済み
- [ ] 重複する環境変数がない

## 📞 次のステップ

このガイドに従って設定後、まだエラーが出る場合：

1. **Vercel Logs を確認**:
   ```
   https://vercel.com/kairyu33s-projects/note-article-manager/logs
   ```

2. **エラーメッセージを全てコピー**

3. **以下の情報を確認**:
   - DATABASE_URLの形式（最初の30文字程度）
   - ビルドログのエラー内容
   - ランタイムログのエラー内容

これで必ず動作します！
