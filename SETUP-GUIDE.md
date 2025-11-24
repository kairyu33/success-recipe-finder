# クイックスタートガイド

## 必要なもの

1. Node.js (18.18.0以上)
2. Anthropic APIキー

## 5分でセットアップ

### 1. Anthropic APIキーを取得

1. [Anthropic Console](https://console.anthropic.com/settings/keys) にアクセス
2. アカウントを作成（まだの場合）
3. 「Create Key」をクリック
4. APIキーをコピー（後で使用します）

### 2. 環境変数を設定

プロジェクトのルートディレクトリで:

```bash
# .env.localファイルを作成
cp .env.example .env.local
```

`.env.local`を編集して、あなたのAPIキーを追加:

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. 依存関係をインストール

```bash
npm install
```

### 4. 開発サーバーを起動

```bash
npm run dev
```

### 5. ブラウザで開く

```
http://localhost:3000
```

## 使い方

1. テキストエリアに記事の内容を貼り付け
2. 「ハッシュタグを生成」ボタンをクリック
3. 生成された20個のハッシュタグが表示されます
4. 個別にクリックするか「すべてコピー」でコピー

## よくある質問

### Q: APIキーはどこで取得できますか？

A: [Anthropic Console](https://console.anthropic.com/settings/keys) で無料アカウントを作成できます。新規ユーザーには$5のクレジットが付与されます。

### Q: エラーが出ます

A: 以下を確認してください:
- `.env.local`ファイルが正しく作成されているか
- APIキーが正しくコピーされているか
- 開発サーバーを再起動してみる (`Ctrl+C` で停止 → `npm run dev` で再起動)

### Q: 料金はかかりますか？

A: Anthropic APIの利用料金がかかります。Claude 3.5 Sonnetの料金:
- Input: $3 / million tokens
- Output: $15 / million tokens

1回のハッシュタグ生成は約$0.01-0.02程度です。

### Q: デプロイするには？

A: Vercelへの無料デプロイが推奨です:

1. GitHubにプッシュ
2. [Vercel](https://vercel.com)にインポート
3. 環境変数 `ANTHROPIC_API_KEY` を追加
4. デプロイ完了！

## トラブルシューティング

### ポート3000が既に使用されている

```bash
# 別のポートで起動
PORT=3001 npm run dev
```

### Next.js関連のエラー

```bash
# キャッシュをクリア
rm -rf .next
npm run dev
```

### 依存関係のエラー

```bash
# クリーンインストール
rm -rf node_modules package-lock.json
npm install
```

## 開発のヒント

### ホットリロード

ファイルを保存すると自動的にブラウザが更新されます。

### TypeScriptエラーを確認

```bash
npm run type-check
```

### コード品質をチェック

```bash
npm run lint
```

### 本番ビルドをテスト

```bash
npm run build
npm start
```

## 次のステップ

- カスタマイズ: `app/page.tsx`を編集してUIを変更
- スタイル調整: `tailwind.config.ts`でテーマをカスタマイズ
- プロンプト改善: `app/api/generate-hashtags/route.ts`でAIプロンプトを調整
- 機能追加: 履歴保存、お気に入り、カテゴリ別生成など

楽しんでください！
