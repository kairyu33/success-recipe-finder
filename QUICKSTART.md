# クイックスタート - 3ステップで起動

## ステップ 1: 環境変数を設定

```bash
# .env.local ファイルを作成
cp .env.example .env.local
```

`.env.local` を編集:
```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxx
```

APIキー取得: https://console.anthropic.com/settings/keys

---

## ステップ 2: 依存関係をインストール

```bash
npm install
```

---

## ステップ 3: 開発サーバーを起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く

---

## 使い方

1. テキストエリアに記事を貼り付け
2. 「ハッシュタグを生成」をクリック
3. 20個のハッシュタグが表示されます
4. クリックでコピー

---

## トラブルシューティング

### エラー: "API key is not configured"

`.env.local` ファイルを作成してAPIキーを追加してください。

### ポート3000が使用中

```bash
PORT=3001 npm run dev
```

### その他の問題

```bash
# キャッシュをクリア
rm -rf .next node_modules
npm install
npm run dev
```

---

## 次のステップ

- 詳細なセットアップ: `SETUP-GUIDE.md`
- 全機能の説明: `FEATURES.md`
- デプロイ方法: `DEPLOYMENT.md`
- プロジェクト概要: `PROJECT-SUMMARY.md`

---

それでは、楽しんでください！
