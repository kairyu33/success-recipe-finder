# 🚀 Success Recipe Finder - 本番環境運用ガイド

## 📋 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [本番環境URL](#本番環境url)
3. [アクセスコード管理](#アクセスコード管理)
4. [データベース管理](#データベース管理)
5. [デプロイ方法](#デプロイ方法)
6. [トラブルシューティング](#トラブルシューティング)

---

## プロジェクト概要

**Success Recipe Finder**は、note.comで公開された571件の成功レシピ記事を検索・閲覧できるWebアプリケーションです。

### 主な機能
- 📝 **571記事**の成功レシピデータベース
- 🔍 記事検索（タイトル、ジャンル、ユーザー層）
- 🎯 フィルター機能（文字数、読了時間、オススメ度）
- 🔐 アクセスコード認証（note.com購読者向け）
- 📊 使用履歴トラッキング

### 技術スタック
- **フロントエンド**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **バックエンド**: Prisma ORM, PostgreSQL
- **認証**: JWT + アクセスコード
- **インフラ**: Vercel (ホスティング + Postgres)

---

## 本番環境URL

### メインアプリケーション
```
https://note-article-manager-260tjzsa7-kairyu33s-projects.vercel.app
```

### 記事一覧ページ
```
https://note-article-manager-260tjzsa7-kairyu33s-projects.vercel.app/articles
```

### GitHubリポジトリ
```
https://github.com/kairyu33/success-recipe-finder
```

---

## アクセスコード管理

### アクセスコードとは？

note.com購読者がアプリケーションにログインするための認証コードです。各コードには以下の属性があります：

- **コード**: `NOTE-XXXXX-XXXXX` 形式の一意な文字列
- **プラン**: `free`, `basic`, `pro`, `unlimited`
- **月間上限**: プランに応じた月間利用可能回数
- **有効期限**: 任意で設定可能（無期限も可）

### アクセスコードの作成方法

#### 方法1: 対話型スクリプト（推奨）

```bash
# ローカル環境で作成
npx tsx scripts/create-access-code.ts

# 本番データベースに直接作成
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')" \
npx tsx scripts/create-access-code.ts
```

**実行例:**
```
🎫 アクセスコード作成ツール

プランを選択してください:
1. free (月5回まで)
2. basic (月30回まで)
3. pro (月100回まで)
4. unlimited (無制限)

プラン番号を入力 (1-4): 3

✨ 生成されたアクセスコード: NOTE-AB3C5-DE7F9-GH2J4

note.com記事URL (オプション、Enterでスキップ): https://note.com/your-article

有効期限を設定しますか？ (y/N): y
有効日数を入力 (例: 365): 365

💾 データベースに保存しています...

✅ アクセスコード作成完了!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 アクセスコード詳細
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
コード: NOTE-AB3C5-DE7F9-GH2J4
プラン: pro
月間上限: 100回
ステータス: active
有効期限: 2026/11/24
note記事: https://note.com/your-article
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### 方法2: バッチモード

環境変数で一括作成する場合:

```bash
# 環境変数で設定
export BATCH_MODE=true
export ACCESS_CODE="NOTE-CUSTOM-12345"
export ACCESS_PLAN="unlimited"
export MONTHLY_LIMIT=999
export EXPIRES_DAYS=365
export NOTE_URL="https://note.com/my-article"
export NOTE_USER_ID="my-note-user-id"

# 本番データベースに作成
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')" \
npx tsx scripts/create-access-code.ts
```

#### 方法3: Prisma Studio（GUI）

```bash
# 本番データベースに接続してPrisma Studioを起動
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')" \
npx prisma studio
```

1. ブラウザで `http://localhost:5555` にアクセス
2. `AccessCode` テーブルを開く
3. 「Add record」をクリック
4. 以下の情報を入力:
   - **code**: `NOTE-YOUR-CODE-001`
   - **plan**: `pro`
   - **status**: `active`
   - **monthlyLimit**: `100`
   - **expiresAt**: `null`（無期限の場合）
5. 「Save 1 change」をクリック

### アクセスコードの確認

#### すべてのアクセスコードを確認
```bash
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')" \
npx prisma studio
```

#### コマンドラインで確認
```bash
# Prisma Clientで確認（scripts/list-access-codes.ts を作成）
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')" \
npx tsx scripts/list-access-codes.ts
```

### アクセスコードの配布

note.com記事で以下のようなテキストを購読者に配布してください：

```markdown
## 🎁 Success Recipe Finderへのアクセス

あなた専用のアクセスコード: **NOTE-XXXXX-XXXXX**

### アクセス方法
1. https://note-article-manager-260tjzsa7-kairyu33s-projects.vercel.app にアクセス
2. 上記のアクセスコードを入力
3. 571件の成功レシピ記事を検索・閲覧できます

### 利用制限
- プラン: pro
- 月間利用回数: 100回まで
- 有効期限: 2026年11月24日まで

### 使い方
1. **検索機能**: 記事タイトルやキーワードで検索
2. **フィルター**: 文字数、読了時間、オススメ度で絞り込み
3. **記事閲覧**: note.comの元記事へ直接リンク

### サポート
質問がある場合は、note.comのメッセージでお問い合わせください。
```

---

## データベース管理

### 本番データベースへの接続

```bash
# 環境変数を取得
cd note-article-manager
npx vercel env pull .env.production

# データベースURL確認
grep DATABASE_URL .env.production
```

### Prisma Studioでデータ確認

```bash
# 本番データベースを開く
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')" \
npx prisma studio
```

### データベーススキーマの更新

```bash
# スキーマ変更後、本番に反映
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')" \
npx prisma db push
```

### バックアップ

```bash
# 本番データのバックアップ作成
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')" \
npx tsx scripts/backup-data.ts
```

バックアップファイルは `backups/backup-YYYY-MM-DDTHH-MM-SS.json` に保存されます。

### データ復元

```bash
# バックアップから復元（本番環境）
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')" \
FORCE_RESTORE=true npx tsx scripts/restore-data.ts

# 特定のバックアップファイルから復元
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')" \
FORCE_RESTORE=true npx tsx scripts/restore-data.ts backups/backup-2025-11-24T03-40-21-693Z.json
```

---

## デプロイ方法

### 初回デプロイ（完了済み）

✅ 以下の手順は既に完了しています：

1. GitHubリポジトリ作成: https://github.com/kairyu33/success-recipe-finder
2. Vercelプロジェクト作成
3. Vercel Postgresデータベース作成
4. 環境変数設定
5. 571記事データ移行

### 更新のデプロイ

コードを更新した場合、Gitにプッシュするだけで自動デプロイされます：

```bash
cd note-article-manager

# 変更をコミット
git add .
git commit -m "Update: 新機能追加"
git push origin main

# Vercelが自動的にビルド・デプロイを開始
```

### デプロイ状況の確認

```bash
# Vercelダッシュボードで確認
# https://vercel.com/kairyu33s-projects/note-article-manager

# または、Vercel CLIで確認
npx vercel list
```

### ロールバック

問題が発生した場合、以前のデプロイに戻すことができます：

1. Vercel Dashboard → Deployments
2. 戻したいデプロイを選択
3. 「...」メニュー → 「Promote to Production」

---

## トラブルシューティング

### Q1: アクセスコードでログインできない

**原因:**
- コードが無効化されている
- 有効期限切れ
- 月間上限に達している

**解決方法:**
```bash
# Prisma Studioでコードの状態を確認
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')" \
npx prisma studio

# AccessCodeテーブルで該当コードを確認:
# - status が "active" か
# - expiresAt が未来の日時か（または null）
# - monthlyLimit に余裕があるか
```

### Q2: データベース接続エラー

**エラーメッセージ:**
```
P1001: Can't reach database server
```

**解決方法:**
```bash
# 1. DATABASE_URLが正しく設定されているか確認
grep DATABASE_URL .env.production

# 2. Vercel Dashboardで確認
# https://vercel.com/kairyu33s-projects/note-article-manager/settings/environment-variables

# 3. 環境変数を再取得
npx vercel env pull .env.production
```

### Q3: ビルドエラー

**エラーメッセージ:**
```
Error: Cannot find module '@prisma/client'
```

**解決方法:**
```bash
# package.jsonにpostinstallスクリプトがあるか確認
grep -A 2 '"scripts"' package.json | grep postinstall

# なければ追加:
# "postinstall": "prisma generate"

# 再デプロイ
git add package.json
git commit -m "Add prisma generate to postinstall"
git push origin main
```

### Q4: 記事が表示されない

**原因:**
- データ移行が未完了
- データベーススキーマのミスマッチ

**解決方法:**
```bash
# 1. 記事数を確認
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')" \
npx prisma studio
# → Articleテーブルに571件あるか確認

# 2. データがない場合は復元
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')" \
FORCE_RESTORE=true npx tsx scripts/restore-data.ts

# 3. スキーマ同期
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')" \
npx prisma db push
```

### Q5: 401 Unauthorized エラー

**これは正常な動作です！**

アプリケーションはアクセスコード認証で保護されています。ユーザーは有効なアクセスコードを入力する必要があります。

---

## 監視とアナリティクス

### Vercel Analytics

Vercel Dashboardで以下を確認できます：
- ページビュー数
- ユニークユーザー数
- トラフィックの国別分布
- ページパフォーマンス

**有効化方法:**
1. https://vercel.com/kairyu33s-projects/note-article-manager
2. Analytics タブ
3. 「Enable」をクリック

### Vercel Logs

エラーやwarningを確認：
1. https://vercel.com/kairyu33s-projects/note-article-manager
2. Logs タブ
3. リアルタイムログを確認

---

## セキュリティ

### 環境変数の管理

**重要な環境変数:**
- `DATABASE_URL`: PostgreSQL接続文字列
- `JWT_SECRET`: JWT署名用シークレット（未設定の場合は設定推奨）
- `ADMIN_PASSWORD`: 管理者パスワード（将来の管理画面用）

**設定方法:**
```bash
# Vercel Dashboardで設定
# Settings → Environment Variables

# または、Vercel CLIで設定
npx vercel env add JWT_SECRET production
# プロンプトでシークレット値を入力
```

### アクセスコードの無効化

不正利用が発覚した場合、アクセスコードを無効化できます：

```bash
# Prisma Studioで該当コードのstatusを "revoked" に変更
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')" \
npx prisma studio

# AccessCodeテーブルで:
# - status を "revoked" に変更
# - Save 1 change
```

---

## カスタムドメイン設定（オプション）

より覚えやすいURLにする場合：

1. Vercel Dashboard → Settings → Domains
2. 「Add」をクリック
3. ドメイン名を入力（例: `success-recipe.your-domain.com`）
4. DNSレコードを設定:
   ```
   Type: CNAME
   Name: success-recipe
   Value: cname.vercel-dns.com
   ```
5. DNS反映を待つ（最大48時間、通常は数分）

---

## サポート

### 問い合わせ先
- GitHubリポジトリ: https://github.com/kairyu33/success-recipe-finder/issues
- Vercelサポート: https://vercel.com/support

### 重要なファイル
- `DEPLOYMENT_COMPLETE.md`: デプロイ完了レポート
- `VERCEL_DEPLOY_GUIDE.md`: 初回デプロイガイド
- `prisma/schema.prisma`: データベーススキーマ
- `scripts/backup-data.ts`: バックアップスクリプト
- `scripts/restore-data.ts`: 復元スクリプト
- `scripts/create-access-code.ts`: アクセスコード作成スクリプト

---

**最終更新日**: 2025-11-24
**ステータス**: 🟢 本番稼働中
**記事数**: 571記事
**本番URL**: https://note-article-manager-260tjzsa7-kairyu33s-projects.vercel.app
