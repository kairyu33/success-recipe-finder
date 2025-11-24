# NoteBoost AI - デプロイガイド

## 📋 目次
1. [Vercelデプロイ（推奨）](#vercelデプロイ推奨)
2. [環境変数の設定](#環境変数の設定)
3. [認証システムのセットアップ](#認証システムのセットアップ)
4. [noteへの埋め込み方法](#noteへの埋め込み方法)
5. [カスタムドメインの設定](#カスタムドメインの設定)

---

## Vercelデプロイ（推奨）

### ステップ1: Vercelアカウント作成
1. https://vercel.com にアクセス
2. GitHubアカウントで登録
3. 無料プラン（Hobby）で十分

### ステップ2: プロジェクトのインポート
```bash
# 1. GitHubリポジトリを作成
cd note-hashtag-ai-generator
git init
git add .
git commit -m "Initial commit: NoteBoost AI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/noteboost-ai.git
git push -u origin main

# 2. Vercelでプロジェクトをインポート
# - Vercel Dashboard → "Add New Project"
# - GitHubリポジトリを選択
# - プロジェクト名: noteboost-ai
# - Framework Preset: Next.js
```

### ステップ3: ビルド設定
```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

---

## 環境変数の設定

### Vercel Dashboard で設定

1. プロジェクト → Settings → Environment Variables
2. 以下の変数を追加：

```bash
# 必須
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# オプション（レート制限カスタマイズ）
API_RATE_LIMIT_MAX_REQUESTS=10
API_RATE_LIMIT_WINDOW_MS=60000

# 認証用JWT秘密鍵（本番環境では必ず変更）
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
```

### API キーの取得方法

#### Anthropic API Key
1. https://console.anthropic.com/settings/keys にアクセス
2. "Create Key" をクリック
3. キーをコピーしてVercelに設定

---

## 認証システムのセットアップ

### デフォルト認証情報
本番環境では必ず変更してください！

```typescript
// 現在のデフォルト（開発用）
Username: admin
Password: password123
```

### 本番環境での変更方法

1. `lib/simpleAuth.ts` を編集：
```typescript
// ハードコードされた認証情報を削除
const USERS = [
  {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD_HASH || 'hash_here'
  }
];
```

2. Vercelの環境変数に追加：
```bash
ADMIN_USERNAME=your_secure_username
ADMIN_PASSWORD_HASH=bcrypt_hash_of_your_password
```

3. パスワードハッシュ化：
```bash
npm install -g bcrypt-cli
bcrypt YOUR_SECURE_PASSWORD
```

---

## noteへの埋め込み方法

### 方法1: URLリンクとして共有（推奨）

デプロイ後、以下のようなURLが発行されます：
```
https://noteboost-ai.vercel.app
```

noteの記事に以下のように記載：

```markdown
## NoteBoost AIで記事を最適化

あなたのnote記事を分析してタイトル案やハッシュタグを提案します！

🔗 [NoteBoost AIを使ってみる](https://noteboost-ai.vercel.app)

---

### 使い方
1. 上記リンクをクリック
2. 記事テキストを貼り付け
3. 「記事を分析する」をクリック
4. AI生成された提案を活用！
```

### 方法2: iframeで埋め込み（制限あり）

noteはセキュリティ上、外部iframeの埋め込みに制限があります。
以下のコードは参考用です：

```html
<iframe
  src="https://noteboost-ai.vercel.app"
  width="100%"
  height="800px"
  frameborder="0"
  sandbox="allow-scripts allow-same-origin">
</iframe>
```

**注意**: noteでは外部サイトのiframe埋め込みが制限されています。
直接リンクでの共有を推奨します。

### 方法3: QRコード生成

1. https://www.qr-code-generator.com/ にアクセス
2. デプロイしたURLを入力
3. QRコードを生成してnoteに画像として挿入

---

## カスタムドメインの設定

### Vercelでカスタムドメイン設定

1. ドメインを取得（例: noteboost.com）
2. Vercel Dashboard → Settings → Domains
3. "Add Domain" をクリック
4. ドメインを入力して追加

### DNS設定

ドメイン管理画面で以下を設定：

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

または

```
Type: A
Name: @
Value: 76.76.21.21
```

---

## デプロイ後の確認事項

### ✅ チェックリスト

- [ ] デプロイ成功（Vercelで緑色のステータス）
- [ ] HTTPSアクセス可能
- [ ] 認証ページが表示される
- [ ] ログイン後、記事分析が動作
- [ ] API キーが正しく設定されている
- [ ] レート制限が機能している
- [ ] エラーログが確認できる

### テスト手順

1. デプロイされたURLにアクセス
2. ログイン画面が表示されることを確認
3. デフォルト認証情報でログイン
4. サンプル記事を分析
5. 結果が正しく表示されることを確認
6. テキストダウンロード機能のテスト

---

## トラブルシューティング

### デプロイエラー

**エラー**: Build failed
```bash
# 解決策
1. package.json の依存関係を確認
2. ローカルで npm run build が成功するか確認
3. Node.js バージョンを確認（18.18.0以上）
```

**エラー**: API key is not configured
```bash
# 解決策
1. Vercel Environment Variables を確認
2. ANTHROPIC_API_KEY が正しく設定されているか確認
3. 再デプロイ（Deployments → Redeploy）
```

### API エラー

**エラー**: 429 Too Many Requests
```bash
# 解決策
1. レート制限を緩和（API_RATE_LIMIT_MAX_REQUESTS を増やす）
2. Anthropic API の使用量を確認
3. 有料プランにアップグレード検討
```

---

## セキュリティチェック

デプロイ後、以下を確認：

```bash
# 1. HTTPSが有効か
curl -I https://your-domain.vercel.app

# 2. セキュリティヘッダーが設定されているか
curl -I https://your-domain.vercel.app | grep -i "x-frame-options"

# 3. 認証が機能しているか
curl https://your-domain.vercel.app/api/analyze-article-full \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"articleText":"test"}'
# → 401 Unauthorized が返ればOK
```

---

## パフォーマンス最適化

### 推奨設定

1. **Vercel Edge Network**: 自動有効化
2. **CDN**: Vercelが自動提供
3. **画像最適化**: Next.js Image最適化を使用
4. **コード分割**: Next.js自動実装済み

### 監視ツール

- Vercel Analytics（無料）: 自動有効化
- Google Analytics: 任意追加
- Sentry: エラー監視（推奨）

---

## コスト見積もり

### Vercelホスティング（無料プラン）
- ビルド時間: 100時間/月
- 帯域幅: 100GB/月
- 十分な範囲: 月間数千ユーザー

### Anthropic API（従量課金）
- Claude Sonnet 4.5: $3/1M入力トークン、$15/1M出力トークン
- 1記事分析あたり: 約$0.03-0.05
- 月100記事: 約$3-5
- 月1000記事: 約$30-50

---

## サポート

問題が発生した場合:
1. GitHub Issues: https://github.com/YOUR_USERNAME/noteboost-ai/issues
2. Vercel Support: https://vercel.com/support
3. Anthropic Support: https://support.anthropic.com/

---

**最終更新:** 2025-10-28
**バージョン:** 1.0.0
