# デプロイガイド

このアプリケーションを本番環境にデプロイする方法を説明します。

## Vercelへのデプロイ（推奨）

Vercelは Next.js の開発元で、最も簡単にデプロイできます。

### 前提条件

- GitHubアカウント
- Vercelアカウント（無料）
- Anthropic APIキー

### 手順

#### 1. GitHubにプッシュ

```bash
# Gitリポジトリを初期化（まだの場合）
git init
git add .
git commit -m "Initial commit: note.com hashtag AI generator"

# GitHubリポジトリを作成してプッシュ
git remote add origin https://github.com/yourusername/note-hashtag-ai-generator.git
git branch -M main
git push -u origin main
```

#### 2. Vercelにインポート

1. [Vercel](https://vercel.com)にアクセスしてサインイン
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリを選択
4. プロジェクト設定:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

#### 3. 環境変数を設定

プロジェクト設定画面で:

1. 「Environment Variables」セクションを開く
2. 以下を追加:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-api03-xxxxx` (あなたのAPIキー)
   - Environment: Production, Preview, Development すべて選択

#### 4. デプロイ

「Deploy」ボタンをクリック。数分で完了します。

#### 5. 確認

デプロイが完了したら、提供されたURLにアクセスして動作確認。

### カスタムドメインの設定

1. Vercelプロジェクト設定 → 「Domains」
2. カスタムドメインを追加
3. DNSレコードを設定（Vercelが指示を表示）

## Netlifyへのデプロイ

### 手順

#### 1. GitHubにプッシュ（上記参照）

#### 2. Netlifyにインポート

1. [Netlify](https://netlify.com)にサインイン
2. 「Add new site」→「Import an existing project」
3. GitHubリポジトリを選択
4. Build設定:
   - Build command: `npm run build`
   - Publish directory: `.next`

#### 3. 環境変数を設定

Site settings → Environment variables:
- Key: `ANTHROPIC_API_KEY`
- Value: あなたのAPIキー

#### 4. デプロイ

自動的にデプロイが開始されます。

## Dockerでのデプロイ

### Dockerfileを作成

`Dockerfile`をプロジェクトルートに作成:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### next.config.tsを更新

```typescript
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Docker用に追加
};
```

### ビルドと実行

```bash
# イメージをビルド
docker build -t note-hashtag-ai-generator .

# コンテナを実行
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=your_api_key note-hashtag-ai-generator
```

## Railway へのデプロイ

### 手順

1. [Railway](https://railway.app)にサインイン
2. 「New Project」→「Deploy from GitHub repo」
3. リポジトリを選択
4. 環境変数を設定:
   - `ANTHROPIC_API_KEY`: あなたのAPIキー
5. 自動デプロイ完了

## AWS Amplifyへのデプロイ

### 手順

1. [AWS Amplify Console](https://console.aws.amazon.com/amplify)にアクセス
2. 「New app」→「Host web app」
3. GitHubリポジトリを接続
4. Build設定を確認（自動検出）
5. 環境変数を追加:
   - `ANTHROPIC_API_KEY`
6. デプロイ

## セルフホスティング（VPS）

### 前提条件

- Ubuntu 20.04+ サーバー
- Node.js 18+
- Nginx（リバースプロキシ用）
- PM2（プロセス管理）

### 手順

#### 1. サーバーにコードをデプロイ

```bash
# サーバーにSSH接続
ssh user@your-server-ip

# プロジェクトをクローン
git clone https://github.com/yourusername/note-hashtag-ai-generator.git
cd note-hashtag-ai-generator

# 依存関係をインストール
npm install

# ビルド
npm run build
```

#### 2. 環境変数を設定

```bash
# .env.localを作成
nano .env.local
```

APIキーを追加して保存。

#### 3. PM2でプロセス管理

```bash
# PM2をインストール
npm install -g pm2

# アプリを起動
pm2 start npm --name "hashtag-generator" -- start

# 自動起動設定
pm2 startup
pm2 save
```

#### 4. Nginxをリバースプロキシとして設定

```bash
# Nginxをインストール
sudo apt install nginx

# 設定ファイルを作成
sudo nano /etc/nginx/sites-available/hashtag-generator
```

以下を追加:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 設定を有効化
sudo ln -s /etc/nginx/sites-available/hashtag-generator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. SSL証明書（Let's Encrypt）

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## デプロイ後のチェックリスト

- [ ] アプリケーションが正常に動作する
- [ ] 環境変数が正しく設定されている
- [ ] APIエンドポイントが機能する
- [ ] エラーハンドリングが動作する
- [ ] レスポンシブデザインが機能する
- [ ] SSL証明書が有効（本番環境）
- [ ] パフォーマンスが良好
- [ ] モニタリングが設定されている

## トラブルシューティング

### ビルドエラー

```bash
# キャッシュをクリア
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### 環境変数が読み込まれない

- Vercel/Netlify: プロジェクト設定で再確認
- Docker: `-e` フラグで正しく渡されているか確認
- セルフホスト: `.env.local` ファイルの位置を確認

### APIエラー

- APIキーが有効か確認
- Anthropic APIの制限に達していないか確認
- ログを確認してエラー詳細を取得

## パフォーマンス最適化

### Vercel Edge Functions（オプション）

API routeをEdge Functionsに変更して高速化:

```typescript
// app/api/generate-hashtags/route.ts
export const runtime = 'edge'; // 追加
```

### キャッシング

```typescript
// API レスポンスにキャッシュヘッダーを追加
return NextResponse.json(
  { hashtags },
  {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  }
);
```

## モニタリング

### Vercel Analytics

```bash
npm install @vercel/analytics
```

`app/layout.tsx`に追加:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

デプロイに関する質問や問題があれば、GitHubのissueで報告してください。
