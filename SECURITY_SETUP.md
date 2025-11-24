# 🔒 セキュリティ設定ガイド

## 必須環境変数の設定

アプリケーションを安全に運用するため、以下の環境変数を `.env.local` ファイルに設定してください。

### 1. 基本認証設定

```bash
# JWT Secret（32文字以上推奨）
# 生成コマンド: openssl rand -base64 32
JWT_SECRET=your_generated_secret_here_32_chars_minimum

# 一般ユーザー用パスワード（8文字以上）
MEMBERSHIP_PASSWORD=your_membership_password_here

# 管理者用パスワード（12文字以上推奨）
ADMIN_PASSWORD=your_strong_admin_password_here
```

### 2. API設定

```bash
# Anthropic API Key
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

## セキュリティ機能

### ✅ 実装済みのセキュリティ対策

1. **Prisma Client シングルトン化**
   - コネクションプール枯渇を防止
   - メモリ効率とパフォーマンスの最適化

2. **認証システム**
   - JWT トークンベースのセッション管理
   - HTTPOnly Cookie でXSS攻撃を防止
   - 30日間の自動ログイン

3. **管理画面の二段階保護**
   - 第1段階: 一般ユーザー認証（MEMBERSHIP_PASSWORD）
   - 第2段階: 管理者専用認証（ADMIN_PASSWORD）

4. **APIエンドポイント保護**
   - DELETE/PUT 操作に認証必須
   - レート制限実装済み
   - 本番環境でエラー詳細を非表示

5. **型安全性**
   - TypeScript strict mode 完全準拠
   - Prisma型による安全なDB操作

## パスワードの生成

### 強力なパスワードの作成

```bash
# JWT Secret生成（推奨）
openssl rand -base64 32

# または Node.js で生成
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### パスワード要件

| 項目 | 最小文字数 | 推奨 |
|------|-----------|------|
| JWT_SECRET | 32文字 | 64文字 |
| MEMBERSHIP_PASSWORD | 8文字 | 16文字 |
| ADMIN_PASSWORD | 12文字 | 20文字 |

## アクセス制御

### 一般ユーザー（MEMBERSHIP_PASSWORD）

- `/articles` - 記事一覧・閲覧
- `/login` - ログインページ

### 管理者（ADMIN_PASSWORD）

- `/admin` - 記事管理ダッシュボード
  - CSV インポート
  - 記事編集・削除
  - 全記事管理

## 本番環境へのデプロイ

### Vercel での設定

1. Vercel ダッシュボードにアクセス
2. プロジェクト設定 → Environment Variables
3. 以下の環境変数を追加：

```
JWT_SECRET=<生成した秘密鍵>
MEMBERSHIP_PASSWORD=<設定したパスワード>
ADMIN_PASSWORD=<設定した管理者パスワード>
ANTHROPIC_API_KEY=<あなたのAPIキー>
DATABASE_URL=file:./prisma/dev.db
```

### セキュリティチェックリスト

- [ ] JWT_SECRET は32文字以上
- [ ] ADMIN_PASSWORD は12文字以上の強力なパスワード
- [ ] パスワードをGitにコミットしていない
- [ ] `.env.local` が `.gitignore` に含まれている
- [ ] 本番環境で `NODE_ENV=production` が設定されている
- [ ] HTTPS が有効化されている

## トラブルシューティング

### 認証エラーが発生する場合

```bash
# .env.local ファイルの存在確認
cat .env.local

# 環境変数の読み込み確認
npm run dev
# コンソールで警告が表示されていないか確認
```

### 管理画面にアクセスできない

1. 一般ユーザー認証が成功しているか確認（`/login`）
2. 管理者パスワードが正しく設定されているか確認
3. ブラウザの Cookie が有効になっているか確認

## サポート

問題が解決しない場合は、以下を確認してください：

- コンソールのエラーログ
- ブラウザの開発者ツール（Network タブ）
- `.env.local` の設定内容（パスワードは除く）
