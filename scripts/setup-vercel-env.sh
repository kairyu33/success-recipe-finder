#!/bin/bash
# Vercel本番環境の環境変数設定スクリプト

set -e

echo "🔧 Vercel本番環境の環境変数を設定します..."

# JWT_SECRETを生成
JWT_SECRET=$(openssl rand -base64 32)
echo "✅ JWT_SECRET生成完了"

# パスワードを入力
echo ""
echo "管理者パスワードを入力してください（12文字以上推奨）:"
read -s ADMIN_PASSWORD

if [ -z "$ADMIN_PASSWORD" ]; then
  echo "❌ パスワードが入力されていません"
  exit 1
fi

echo ""
echo "📝 環境変数を設定しています..."

# JWT_SECRETを設定
echo "$JWT_SECRET" | npx vercel env add JWT_SECRET production

# MEMBERSHIP_PASSWORDを設定
echo "$ADMIN_PASSWORD" | npx vercel env add MEMBERSHIP_PASSWORD production

echo ""
echo "✅ 環境変数の設定が完了しました！"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 設定内容"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "JWT_SECRET: ********（自動生成）"
echo "MEMBERSHIP_PASSWORD: ********"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 次のステップ:"
echo "1. Vercel Dashboardで環境変数を確認"
echo "   https://vercel.com/kairyu33s-projects/note-article-manager/settings/environment-variables"
echo ""
echo "2. 本番環境を再デプロイ"
echo "   git commit --allow-empty -m 'redeploy: Update environment variables'"
echo "   git push origin main"
echo ""
