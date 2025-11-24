# 🔑 APIキー設定ガイド

## 📍 設定ファイルの場所

APIキーは以下のファイルに設定します：

```
C:\Users\tyobi\note-hashtag-ai-generator\.env.local
```

---

## 🎯 設定手順（3ステップ）

### ステップ1: Anthropic APIキーを取得

1. **Anthropic Consoleにアクセス**:
   ```
   https://console.anthropic.com/settings/keys
   ```

2. **ログイン**（アカウントがない場合は新規登録）

3. **"Create Key"ボタンをクリック**

4. **キーの名前を入力**（例: note-hashtag-generator）

5. **APIキーが表示されます**
   ```
   sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx...
   ```
   ⚠️ このキーをコピーしてください（一度しか表示されません）

---

### ステップ2: .env.localファイルを開く

**方法1: エクスプローラーから**

1. エクスプローラーを開く
2. 以下のパスに移動:
   ```
   C:\Users\tyobi\note-hashtag-ai-generator
   ```
3. `.env.local`ファイルをメモ帳で開く
   - ファイルが見えない場合は「隠しファイルを表示」を有効に

**方法2: コマンドから**

```bash
# メモ帳で開く
notepad C:\Users\tyobi\note-hashtag-ai-generator\.env.local

# または VSCodeで開く
code C:\Users\tyobi\note-hashtag-ai-generator\.env.local
```

---

### ステップ3: APIキーを貼り付けて保存

ファイルを開いたら、以下の行を探します：

```env
# Anthropic API Key
# Get your API key from: https://console.anthropic.com/settings/keys
# 👉 ここにあなたのAPIキーを入力してください
ANTHROPIC_API_KEY=
```

**変更前**:
```env
ANTHROPIC_API_KEY=
```

**変更後**（例）:
```env
ANTHROPIC_API_KEY=sk-ant-api03-ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
```

👆 `=` の後に、ステップ1でコピーしたAPIキーを貼り付けます

**保存**: `Ctrl + S` または ファイル → 保存

---

## ✅ 確認方法

### サーバーは自動的に設定を読み込みます

設定後、ブラウザで以下にアクセス:
```
http://localhost:3005
```

### テスト実行

1. 短い文章を入力（例: "これはテストです"）
2. 「記事を分析する」をクリック
3. **成功**: ハッシュタグやタイトルが表示される
4. **失敗**: エラーメッセージが表示される

---

## 🔴 エラーが出た場合

### エラー: "API key is required"

**原因**: APIキーが設定されていない

**解決策**:
1. `.env.local`ファイルを再確認
2. `ANTHROPIC_API_KEY=`の後にキーが正しく入力されているか確認
3. スペースや改行が入っていないか確認
4. ブラウザを再読み込み（F5）

### エラー: "Invalid API key" または 401エラー

**原因**: APIキーが間違っている、または無効

**解決策**:
1. APIキーを再コピー（最初と最後に余分な文字がないか確認）
2. Anthropic Consoleでキーが有効か確認
3. 新しいキーを生成して再設定

### サーバーが起動しない

**解決策**:
```bash
# 既存のサーバーを停止
taskkill /F /IM node.exe

# サーバーを再起動
cd C:\Users\tyobi\note-hashtag-ai-generator
npm run dev
```

---

## 💡 よくある質問

### Q: APIキーはどこで取得できますか？
A: Anthropic Console (https://console.anthropic.com/settings/keys) で無料で取得できます。

### Q: APIキーにお金がかかりますか？
A: Anthropicアカウントは無料で作成できます。使用量に応じて課金されます（初回クレジット付与あり）。

### Q: .env.localファイルが見つかりません
A: エクスプローラーの設定で「隠しファイルを表示」を有効にしてください。

### Q: 設定後、すぐに使えますか？
A: はい。Next.jsは自動的に.env.localファイルを読み込みます。ブラウザを更新するだけで使えます。

### Q: 複数のAPIキーを設定できますか？
A: いいえ。1つのAPIキーのみ設定してください。

---

## 🎯 設定ファイルの完全な例

```env
# Anthropic API Key
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here

# Cost Control Settings
MAX_TOKENS_PER_REQUEST=3072

# Maximum article length in characters (変更: 10000 → 30000)
MAX_ARTICLE_LENGTH=30000

# Rate Limiting
API_RATE_LIMIT_MAX_REQUESTS=10
API_RATE_LIMIT_WINDOW_MS=60000

# Caching Configuration
ENABLE_CACHING=false
CACHE_TTL_MS=1800000
CACHE_MAX_SIZE=1000

# Request Deduplication
ENABLE_REQUEST_DEDUPLICATION=true
DEDUPLICATION_WINDOW_MS=30000

# Usage Analytics
ENABLE_USAGE_ANALYTICS=true
LOG_DETAILED_USAGE=false
```

**重要**: `ANTHROPIC_API_KEY=`の行だけ変更すれば動作します。他の設定はオプションです。

---

## 🛡️ セキュリティ

### APIキーを安全に保つために

- ✅ `.env.local`はGitで追跡されません
- ✅ 他人とAPIキーを共有しない
- ✅ 公開リポジトリにアップロードしない
- ✅ スクリーンショットを共有する際は隠す

### APIキーが漏洩した場合

1. **すぐに無効化**: https://console.anthropic.com/settings/keys
2. 新しいキーを生成
3. `.env.local`を更新

---

## 📞 サポート

### 設定がうまくいかない場合

1. **ファイルの場所を確認**:
   ```bash
   cd C:\Users\tyobi\note-hashtag-ai-generator
   dir .env.local
   ```

2. **ファイルの内容を確認**:
   ```bash
   type .env.local
   ```

3. **サーバーのログを確認**:
   ターミナルに表示されているエラーメッセージを確認

---

## 🎉 設定完了後

APIキーを設定したら、以下のすべての機能が使用可能になります：

- ✅ ハッシュタグ自動生成（20個）
- ✅ タイトル提案（5案）
- ✅ アイキャッチ画像提案
- ✅ 記事分析（学び、メリット、推奨読者）
- ✅ SEO最適化分析
- ✅ 記事改善提案
- ✅ 分析履歴管理
- ✅ 多形式エクスポート

**最大30,000文字**の記事を分析して、note.comでの成功を目指しましょう！

---

**更新日**: 2025年10月26日
