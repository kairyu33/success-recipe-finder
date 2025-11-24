# 🚀 START HERE - note.com ハッシュタグ AI ジェネレーター

## 📋 このプロジェクトについて

Claude AIを使用してnote.com記事に最適なハッシュタグを自動生成する**Next.js 16**アプリケーションです。

### 主な機能
- ✨ AI駆動のハッシュタグ生成（20個）
- 📱 レスポンシブデザイン
- 🌓 ダーク/ライトモード対応
- 📋 ワンクリックコピー機能
- ⚡ 高速・モダンなUI

---

## ⚡ クイックスタート（5分）

### 1. APIキーを取得
1. https://console.anthropic.com/settings/keys にアクセス
2. アカウント作成（無料 - $5クレジット付与）
3. APIキーをコピー

### 2. セットアップ
```bash
# プロジェクトディレクトリに移動
cd C:\Users\tyobi\note-hashtag-ai-generator

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.local を開いてAPIキーを追加
```

### 3. 起動
```bash
npm run dev
```

### 4. ブラウザで開く
```
http://localhost:3000
```

---

## 📚 ドキュメント一覧

プロジェクトには充実したドキュメントが用意されています：

### 🎯 セットアップ関連
- **QUICKSTART.md** - 3ステップで起動する方法
- **SETUP-GUIDE.md** - 詳細なセットアップ手順
- **README.md** - プロジェクト全体の説明

### 🔧 開発関連
- **PROJECT-SUMMARY.md** - プロジェクト全体の概要
- **FEATURES.md** - 実装されている全機能の詳細
- **.env.example** - 環境変数テンプレート

### 🚀 デプロイ関連
- **DEPLOYMENT.md** - 本番環境へのデプロイ方法
  - Vercel（推奨）
  - Netlify
  - Docker
  - Railway
  - AWS Amplify
  - セルフホスティング

---

## 📁 プロジェクト構造

```
note-hashtag-ai-generator/
│
├── 📱 app/                          # Next.js App
│   ├── api/generate-hashtags/      # API Route
│   │   └── route.ts                # Claude API統合
│   ├── layout.tsx                  # アプリレイアウト
│   ├── page.tsx                    # メインUI
│   └── globals.css                 # スタイル
│
├── 📖 ドキュメント/
│   ├── README.md                   # メインREADME
│   ├── QUICKSTART.md               # クイックスタート
│   ├── SETUP-GUIDE.md              # セットアップガイド
│   ├── FEATURES.md                 # 機能詳細
│   ├── DEPLOYMENT.md               # デプロイガイド
│   ├── PROJECT-SUMMARY.md          # プロジェクト概要
│   └── START-HERE.md               # このファイル
│
├── ⚙️ 設定ファイル/
│   ├── .env.example                # 環境変数テンプレート
│   ├── next.config.ts              # Next.js設定
│   ├── tailwind.config.ts          # Tailwind設定
│   ├── tsconfig.json               # TypeScript設定
│   └── package.json                # npm設定
│
└── 🛠️ ツール/
    └── setup.js                    # セットアップスクリプト
```

---

## 💻 開発コマンド

### 基本コマンド
```bash
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド
npm start            # 本番サーバー起動
npm run lint         # コード品質チェック
npm run type-check   # TypeScript型チェック
npm run setup        # 対話式セットアップ
```

### トラブルシューティング
```bash
# キャッシュクリア
rm -rf .next

# クリーンインストール
rm -rf node_modules package-lock.json
npm install

# 別のポートで起動
PORT=3001 npm run dev
```

---

## 🎨 技術スタック

### フロントエンド
- **Next.js 16.0** - React フレームワーク
- **React 19.2** - UI ライブラリ
- **TypeScript 5.9** - 型安全な開発
- **Tailwind CSS 4.1** - ユーティリティCSS

### AI
- **Anthropic Claude 3.5 Sonnet** - 最新AIモデル
- **@anthropic-ai/sdk 0.67** - 公式SDK

### ツール
- **ESLint** - コード品質
- **PostCSS** - CSS処理

---

## 🔑 環境変数

必要な環境変数は1つだけ：

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx
```

**取得先**: https://console.anthropic.com/settings/keys

**設定方法**:
1. `.env.example` を `.env.local` にコピー
2. APIキーを追加
3. サーバーを起動

---

## 📖 使い方

### 基本的な使い方
1. **記事を入力**: テキストエリアに記事を貼り付け
2. **生成**: 「ハッシュタグを生成」ボタンをクリック
3. **コピー**: 個別またはすべてをコピー
4. **note.comで使用**: 記事に貼り付け

### 対応する記事の長さ
- 最小: 数文字から
- 最大: 10,000文字

### 生成されるハッシュタグ
- 数: 20個
- 形式: `#タグ名`
- 言語: 主に日本語
- 最適化: note.com向け

---

## 🚀 デプロイ

### Vercel（最も簡単）
1. GitHubにプッシュ
2. Vercelにインポート
3. 環境変数を設定
4. デプロイ完了

詳細は `DEPLOYMENT.md` を参照。

---

## 🎯 次のステップ

### すぐに始める
1. ✅ `npm install` で依存関係をインストール
2. ✅ `.env.local` でAPIキーを設定
3. ✅ `npm run dev` で起動
4. ✅ http://localhost:3000 を開く

### カスタマイズ
- `app/page.tsx` - UIをカスタマイズ
- `tailwind.config.ts` - テーマを変更
- `app/api/generate-hashtags/route.ts` - AIプロンプトを調整

### 本番デプロイ
- `DEPLOYMENT.md` を読む
- Vercelにデプロイ
- カスタムドメインを設定

---

## 💡 よくある質問

### Q: 料金はかかりますか？
A: Anthropic APIの利用料金がかかります。1回の生成で約$0.01-0.02程度です。

### Q: APIキーはどこで取得？
A: https://console.anthropic.com/settings/keys で無料アカウント作成（$5クレジット付与）

### Q: エラーが出ます
A:
1. `.env.local`が正しいか確認
2. APIキーが有効か確認
3. `npm run dev` でサーバー再起動

### Q: カスタマイズしたい
A: 各ファイルにコメントが豊富にあります。自由に編集してください。

---

## 🤝 サポート

### 問題が発生した場合
1. `SETUP-GUIDE.md` のトラブルシューティングを確認
2. `README.md` の詳細説明を読む
3. GitHubでissueを作成

### コミュニティ
- Pull Requestを歓迎します
- 改善提案をissueで共有してください

---

## 📄 ライセンス

ISC License - 自由に使用・変更・配布可能

---

## 🎉 それでは、始めましょう！

```bash
npm run dev
```

そして http://localhost:3000 を開いてください。

質問があれば、各ドキュメントを参照するか、GitHubでissueを作成してください。

**楽しいハッシュタグ生成を！** 🚀✨
