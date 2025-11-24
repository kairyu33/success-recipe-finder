# 🚀 クイックフィックス: データベース接続エラー

## 問題
https://note-article-manager-oihn8knf2-kairyu33s-projects.vercel.app/admin でデータベースにアクセスできません。

## 解決策（3ステップ）

### ステップ1: コード修正を適用（✅ 完了）

以下の修正が適用されました：
- `package.json`の`build`スクリプトにPrismaマイグレーションを追加

### ステップ2: Vercel環境変数を確認

1. **Vercel Dashboardにアクセス**
   ```
   https://vercel.com/kairyu33s-projects/note-article-manager/settings/environment-variables
   ```

2. **以下の環境変数が`Production`環境に設定されているか確認**:
   - `DATABASE_URL` - PostgreSQL接続URL
   - `POSTGRES_URL` - Postgres URL（オプション）
   - `PRISMA_DATABASE_URL` - Prisma Accelerate URL（オプション）
   - `JWT_SECRET` - JWT秘密鍵
   - `MEMBERSHIP_PASSWORD` - 管理パスワード

3. **DATABASE_URLが未設定の場合**:
   - `.env.production`ファイルを確認
   - そこにある`DATABASE_URL`の値をコピー
   - Vercel Dashboardで`DATABASE_URL`を追加（Environment: Production）

### ステップ3: 再デプロイ

#### 方法A: Gitでデプロイ（推奨）

```bash
cd note-article-manager

# 変更をコミット
git add package.json VERCEL_ENV_SETUP.md QUICK_FIX.md scripts/
git commit -m "fix: Add database migration to build script"

# デプロイ
git push origin main
```

#### 方法B: Vercel Dashboardで再デプロイ

1. https://vercel.com/kairyu33s-projects/note-article-manager にアクセス
2. 最新のデプロイメントの「...」メニューをクリック
3. 「Redeploy」を選択

---

## 動作確認

デプロイが完了したら（通常30〜60秒）:

1. **管理画面にアクセス**
   ```
   https://note-article-manager-oihn8knf2-kairyu33s-projects.vercel.app/admin
   ```

2. **ログイン**
   - パスワードを入力（環境変数で設定した値）

3. **記事一覧が表示されることを確認**
   - データベースエラーが出ないことを確認

---

## トラブルシューティング

### エラー: "記事一覧の取得に失敗しました"

**原因**: DATABASE_URLが設定されていない

**解決策**:
1. Vercel Dashboard → Settings → Environment Variables
2. `DATABASE_URL`を追加（値は`.env.production`から取得）
3. 再デプロイ

### エラー: "P1001: Can't reach database server"

**原因**: DATABASE_URLの値が間違っている

**解決策**:
1. `.env.production`ファイルの`DATABASE_URL`を確認
2. Vercel Dashboardで`DATABASE_URL`を更新
3. 再デプロイ

### エラー: "P3009: migrate.lock file contains a different migrationLockId"

**原因**: マイグレーションの不整合

**解決策**:
```bash
cd note-article-manager

# マイグレーションをリセット
npx prisma migrate reset --force

# 再度マイグレーションを実行
npx prisma migrate deploy

# デプロイ
git add .
git commit -m "fix: Reset migrations"
git push origin main
```

---

## サポート

問題が解決しない場合は、以下を確認してください：

1. **Vercel Logs**
   ```
   https://vercel.com/kairyu33s-projects/note-article-manager/logs
   ```

2. **環境変数一覧**
   ```bash
   npx vercel env ls
   ```

3. **詳細ガイド**
   - `VERCEL_ENV_SETUP.md`を参照してください
