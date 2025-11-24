# Success Recipe Finder (成功レシピ 記事検索)

成功レシピ記事検索システム - note.comの記事を効率的に検索・管理できるWebアプリケーション

## 🌟 特徴

- 📚 **高度な記事検索**: ジャンル、対象、おすすめ度で記事を簡単に検索
- 📱 **完全レスポンシブ**: PC・タブレット・モバイル対応
- 🎨 **モダンUI**: 美しいグラデーションとスムーズなアニメーション
- ⚡ **リアルタイム検索**: 即座にフィルタリング結果を表示
- 🔐 **セキュア**: JWT認証による管理画面保護
- 🚀 **Vercel Ready**: ワンクリックでデプロイ可能

## 🚀 技術スタック

| カテゴリ | 技術 |
|---------|-----|
| **フロントエンド** | Next.js 16 + React 19 + TypeScript |
| **スタイリング** | Tailwind CSS 4 (インラインスタイル併用) |
| **データベース** | SQLite (開発) / PostgreSQL (本番) + Prisma ORM |
| **認証** | Jose (JWT) |
| **通知** | Sonner (Toast) |
| **デプロイ** | Vercel / Railway / Render |

## 📦 クイックスタート

### 前提条件

- Node.js 18.18.0以上
- npm または yarn

### インストール手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/yourusername/success-recipe-finder.git
cd success-recipe-finder

# 2. 依存関係をインストール
npm install

# 3. 環境変数を設定
cp .env.example .env.local
# .env.localを編集 (詳細は下記参照)

# 4. データベースをセットアップ
npx prisma generate
npx prisma db push

# 5. 開発サーバーを起動
npm run dev
```

アプリケーションは **http://localhost:3003** で起動します。

### 環境変数設定

`.env.local` ファイルを作成し、以下の変数を設定:

```env
# データベースURL
DATABASE_URL="file:./dev.db"

# JWT認証用シークレット（32文字以上のランダム文字列を生成）
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"

# 管理者パスワード（本番環境では強力なパスワードに変更）
ADMIN_PASSWORD="your-secure-admin-password"

# オプション: Node環境
NODE_ENV="development"
```

**セキュリティ**: 本番環境では必ず強力なパスワードとJWT_SECRETを使用してください。

## 🌐 デプロイ

### Vercel へのデプロイ（推奨）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/success-recipe-finder)

1. 上記ボタンをクリックまたは手動でVercelにログイン
2. GitHubリポジトリを接続
3. 環境変数を設定:
   ```
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters
   ADMIN_PASSWORD=your-admin-password
   DATABASE_URL=postgres://... (Vercel Postgresを使用)
   ```
4. "Deploy" をクリック
5. デプロイ完了後、`/admin` でログインして記事をインポート

### Railway / Render へのデプロイ

同様の手順で環境変数を設定してデプロイ可能です。

## 📖 使い方

### 一般ユーザー向け

1. **記事を検索**
   - トップページ（`/articles`）にアクセス
   - 検索バーにキーワードを入力
   - ジャンル・対象・おすすめ度でフィルタリング

2. **モバイルでの検索**
   - "フィルター"ボタンをタップ
   - ドロワーメニューからフィルター選択
   - 適用すると即座に結果が更新

3. **記事を読む**
   - 記事カードをクリックしてnote.comの元記事を表示

### 管理者向け

1. **ログイン**
   - `/admin` にアクセス
   - 管理者パスワードを入力

2. **記事をCSVで一括登録**
   - 「記事管理」タブ → 「CSV一括登録」
   - CSVファイルを選択してアップロード
   - 既存記事は自動的にスキップ（差分登録）

3. **メンバーシップ管理**
   - 「メンバーシップ管理」タブで作成・編集
   - カラー、表示順序を設定

### CSVフォーマット

```csv
rowNumber,title,noteLink,publishedAt,characterCount,estimatedReadTime,genre,targetAudience,benefit,recommendationLevel,membershipIds
1,成功事例タイトル,https://note.com/user/n/xxxxx,2024-01-01,3000,10,副業・起業,初心者,収益化ノウハウ,★★★★★,membership-id-1;membership-id-2
```

## 🗂️ プロジェクト構造

```
success-recipe-finder/
├── app/                        # Next.js App Router
│   ├── articles/              # 📖 記事検索ページ（メイン）
│   │   └── page.tsx          # レスポンシブ対応検索UI
│   ├── admin/                 # 🔐 管理画面
│   │   ├── page.tsx          # 管理ダッシュボード
│   │   └── login/            # ログインページ
│   ├── api/                   # 🔌 APIルート
│   │   ├── articles/         # 記事API
│   │   ├── memberships/      # メンバーシップAPI
│   │   └── auth/             # 認証API
│   ├── components/            # ⚛️ Reactコンポーネント
│   │   └── articles/         # 記事関連コンポーネント
│   │       ├── ArticleCard.tsx        # 記事カード
│   │       ├── FilterSection.tsx      # フィルターセクション
│   │       ├── MobileFilterDrawer.tsx # モバイルドロワー
│   │       ├── MultiSelectFilter.tsx  # 複数選択フィルター
│   │       └── SearchBar.tsx          # 検索バー
│   ├── hooks/                 # 🎣 カスタムフック
│   │   └── useMediaQuery.ts  # レスポンシブ検出
│   └── globals.css           # グローバルスタイル
├── lib/                       # 🛠️ ユーティリティ
│   ├── api.ts                # API関数
│   ├── simpleAuth.ts         # 認証ロジック
│   └── utils.ts              # ヘルパー関数
├── prisma/                    # 💾 データベース
│   ├── schema.prisma         # Prismaスキーマ
│   └── dev.db                # SQLiteデータベース（開発用）
├── public/                    # 📁 静的ファイル
│   └── MT/top.jpg            # ヘッダー画像
└── package.json              # 依存関係管理
```

## 🎨 主な機能

### PC版
- ✅ 2カラムレイアウト（300px固定サイドバー + 記事リスト）
- ✅ 左サイドバーにフィルター常時表示
- ✅ 記事は横並び1行表示
- ✅ Stickyサイドバー

### モバイル版
- ✅ 1カラムレイアウト
- ✅ フィルターボタンでドロワー表示
- ✅ 右側からスライドインアニメーション
- ✅ 記事は縦並びカード表示
- ✅ タイトル2行まで表示

### 検索・フィルター機能
- ✅ リアルタイムキーワード検索
- ✅ ジャンル別フィルター
- ✅ 対象読者別フィルター
- ✅ おすすめ度別フィルター（降順ソート）
- ✅ 複数条件の組み合わせ検索
- ✅ ソート機能（公開日、文字数、読了時間）

## 🔧 開発コマンド

```bash
# 開発サーバー起動（ポート3003）
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# TypeScript型チェック
npm run type-check

# ESLint実行
npm run lint

# Prisma Studio起動（DB管理GUI）
npx prisma studio
```

## 📊 データベーススキーマ

### Article（記事）
| フィールド | 型 | 説明 |
|-----------|-----|-----|
| id | String | UUID |
| rowNumber | Int | 行番号 |
| title | String | タイトル |
| noteLink | String | noteリンク（ユニーク） |
| publishedAt | DateTime | 公開日時 |
| characterCount | Int | 文字数 |
| estimatedReadTime | Int | 推定読了時間（分） |
| genre | String | ジャンル |
| targetAudience | String | 対象読者 |
| benefit | String | メリット |
| recommendationLevel | String | おすすめ度（★★★★★） |
| memberships | Relation[] | メンバーシップ（多対多） |

### Membership（メンバーシップ）
| フィールド | 型 | 説明 |
|-----------|-----|-----|
| id | String | UUID |
| name | String | メンバーシップ名 |
| description | String | 説明 |
| color | String | カラーコード |
| sortOrder | Int | 表示順序 |
| isActive | Boolean | 有効/無効 |

## 🔐 セキュリティ

- ✅ JWT認証による管理画面保護
- ✅ HTTPSのみでのクッキー送信（本番環境）
- ✅ 環境変数による機密情報管理
- ✅ パスワードの平文保存なし
- ✅ XSS対策（React自動エスケープ）

**重要**:
- `.env` ファイルは`.gitignore`に含まれています
- `JWT_SECRET`は32文字以上のランダム文字列を使用
- 本番環境では必ず強力なパスワードを設定

## 🤝 コントリビューション

プルリクエストを歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 🙏 謝辞

- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [Prisma](https://www.prisma.io/) - 次世代ORM
- [Vercel](https://vercel.com/) - ホスティングプラットフォーム
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSS

## 📞 サポート

問題が発生した場合は、[Issues](https://github.com/yourusername/success-recipe-finder/issues)で報告してください。

---

**Made with ❤️ by Claude Code + Human Collaboration**
