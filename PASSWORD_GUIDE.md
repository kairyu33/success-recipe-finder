# 🔐 パスワード変更ガイド

## アプリケーション起動中！

**アクセスURL**:
- **メインアプリ**: http://localhost:3000
- **管理画面**: http://localhost:3000/admin

---

## 現在のパスワード設定

### 1. 一般ユーザーパスワード（MEMBERSHIP_PASSWORD）
```
note2025january
```
- **用途**: 記事一覧ページへのアクセス
- **ログインページ**: http://localhost:3000/login

### 2. 管理者パスワード（ADMIN_PASSWORD）
```
admin2025secure
```
- **用途**: 管理画面へのアクセス
- **管理画面**: http://localhost:3000/admin
- **注意**: 管理画面にアクセスするには、まず一般ユーザーとしてログイン後、管理者パスワードが必要です

---

## パスワードの変更方法

### 方法1: .env.local ファイルを直接編集（推奨）

1. **ファイルを開く**
   ```bash
   # Visual Studio Codeで開く
   code C:\Users\tyobi\note-hashtag-ai-generator\.env.local

   # メモ帳で開く
   notepad C:\Users\tyobi\note-hashtag-ai-generator\.env.local
   ```

2. **パスワードを変更**
   ```env
   # 一般ユーザー用パスワード
   MEMBERSHIP_PASSWORD="あなたの新しいパスワード"

   # 管理者用パスワード（12文字以上推奨）
   ADMIN_PASSWORD="あなたの新しい管理者パスワード"
   ```

3. **保存して開発サーバーを再起動**
   ```bash
   # Ctrl+C で開発サーバーを停止
   # 再度起動
   cd C:\Users\tyobi\note-hashtag-ai-generator
   npm run dev
   ```

### 方法2: コマンドラインで変更

```bash
cd C:\Users\tyobi\note-hashtag-ai-generator

# 一般ユーザーパスワードを変更
echo MEMBERSHIP_PASSWORD="new_password_here" >> .env.local

# 管理者パスワードを変更
echo ADMIN_PASSWORD="new_admin_password_here" >> .env.local
```

---

## アクセス手順

### ステップ1: 一般ユーザーとしてログイン

1. ブラウザで http://localhost:3000 にアクセス
2. 自動的にログインページ（`/login`）にリダイレクト
3. パスワード入力: `note2025january`
4. 「ログイン」ボタンをクリック
5. 記事一覧ページ（`/articles`）に移動

### ステップ2: 管理画面にアクセス

1. ログイン後、http://localhost:3000/admin にアクセス
2. 管理者認証画面が表示される
3. 管理者パスワード入力: `admin2025secure`
4. 「ログイン」ボタンをクリック
5. 管理画面ダッシュボードが表示される

---

## セキュリティのベストプラクティス

### 推奨パスワード要件

| パスワード | 最小文字数 | 推奨文字数 | 含めるべき文字 |
|-----------|-----------|-----------|---------------|
| MEMBERSHIP_PASSWORD | 8文字 | 12-16文字 | 英数字 + 記号 |
| ADMIN_PASSWORD | 12文字 | 16-20文字 | 大小英字 + 数字 + 記号 |

### 強力なパスワードの例

```bash
# ランダムパスワード生成（PowerShell）
# 16文字のランダムパスワード
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 16 | ForEach-Object {[char]$_})

# または OpenSSL（Git Bashなど）
openssl rand -base64 16
```

### 定期的な変更

- **一般ユーザーパスワード**: 月1回変更推奨
- **管理者パスワード**: 3ヶ月に1回変更推奨
- **JWT_SECRET**: 6ヶ月に1回変更推奨

---

## トラブルシューティング

### パスワードが認証されない

1. **スペースや引用符を確認**
   ```env
   ❌ ADMIN_PASSWORD="password123 "  # 末尾にスペース
   ✅ ADMIN_PASSWORD="password123"

   ❌ ADMIN_PASSWORD=password123'    # 混在引用符
   ✅ ADMIN_PASSWORD="password123"
   ```

2. **開発サーバーを再起動**
   - `.env.local` を変更した後は必ず再起動

3. **ブラウザのキャッシュをクリア**
   ```
   Chrome: Ctrl + Shift + Delete
   Edge: Ctrl + Shift + Delete
   ```

### 管理画面にアクセスできない

- 先に一般ユーザーとしてログインしましたか？
- Cookie が有効になっていますか？
- シークレットモードで試してみてください

---

## 本番環境での設定

### Vercel へのデプロイ時

1. Vercel ダッシュボードにアクセス
2. プロジェクト → Settings → Environment Variables
3. 以下を追加:

```
MEMBERSHIP_PASSWORD=<強力なパスワード>
ADMIN_PASSWORD=<非常に強力なパスワード>
JWT_SECRET=<32文字以上のランダム文字列>
```

### セキュリティチェックリスト

- [ ] パスワードに推測されにくい文字列を使用
- [ ] 本番環境用に別のパスワードを設定
- [ ] パスワードをGitにコミットしない
- [ ] 定期的にパスワードを変更
- [ ] パスワードマネージャーで管理

---

## 問い合わせ

パスワードやセキュリティに関する質問は `SECURITY_SETUP.md` も参照してください。
