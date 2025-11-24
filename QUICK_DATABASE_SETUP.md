# ⚡ クイックデータベースセットアップ（3ステップ）

## ステップ1: Vercel Postgresを作成（2分）

1. **Vercelにアクセス**: https://vercel.com/kairyu33s-projects/note-article-manager
2. **"Storage"** タブをクリック
3. **"Create Database"** → **"Postgres"** を選択
4. データベース名: `note-article-db`
5. リージョン: **Tokyo (hnd1)**
6. **"Create"** をクリック
7. **"Connect Project"** → **note-article-manager** → **Production** → **"Connect"**

## ステップ2: DATABASE_URLを追加（1分）

1. **Settings** → **Environment Variables**: https://vercel.com/kairyu33s-projects/note-article-manager/settings/environment-variables
2. **"Add New"** をクリック
3. Key: `DATABASE_URL`
4. Value: `POSTGRES_PRISMA_URL`の値をコピー（下にあります）
5. Environment: **Production** にチェック
6. **"Save"**

**その他の必要な環境変数**:

```bash
# JWT_SECRET（以下のコマンドで生成）
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# MEMBERSHIP_PASSWORD（管理画面パスワード）
任意の強力なパスワード（8文字以上）
```

それぞれ追加してください。

## ステップ3: 再デプロイ（30秒）

**方法A**: Dashboard
1. **Deployments** タブ
2. 最新デプロイの **"..."** → **"Redeploy"**

**方法B**: Git Push
```bash
cd note-article-manager
git commit --allow-empty -m "chore: Trigger redeploy"
git push origin main
```

## ✅ 確認

デプロイ完了後（1〜2分）:
```
https://note-article-manager-oihn8knf2-kairyu33s-projects.vercel.app/admin
```

にアクセスしてログイン！

---

**問題が発生した場合**: `DATABASE_SETUP_GUIDE.md` を参照
