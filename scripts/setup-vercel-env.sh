#!/bin/bash

# Vercel環境変数設定スクリプト
# このスクリプトは、Vercel CLIを使用して本番環境の環境変数を設定します

set -e

echo "🚀 Vercel環境変数設定を開始します..."
echo ""

# Vercel CLIがインストールされているか確認
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLIがインストールされていません"
    echo "以下のコマンドでインストールしてください:"
    echo "  npm install -g vercel"
    exit 1
fi

echo "📋 環境変数を設定します..."
echo ""

# DATABASE_URLの確認
if [ -f .env.production ]; then
    echo "✅ .env.productionファイルが見つかりました"

    # DATABASE_URLを抽出
    DATABASE_URL=$(grep "^DATABASE_URL=" .env.production | cut -d '=' -f2- | tr -d '"')

    if [ -n "$DATABASE_URL" ]; then
        echo "📦 DATABASE_URLをVercelに設定中..."
        vercel env add DATABASE_URL production <<< "$DATABASE_URL"
        echo "✅ DATABASE_URLを設定しました"
    else
        echo "⚠️  .env.productionにDATABASE_URLが見つかりません"
    fi

    # POSTGRES_URLを抽出
    POSTGRES_URL=$(grep "^POSTGRES_URL=" .env.production | cut -d '=' -f2- | tr -d '"')

    if [ -n "$POSTGRES_URL" ]; then
        echo "📦 POSTGRES_URLをVercelに設定中..."
        vercel env add POSTGRES_URL production <<< "$POSTGRES_URL"
        echo "✅ POSTGRES_URLを設定しました"
    fi

    # PRISMA_DATABASE_URLを抽出
    PRISMA_DATABASE_URL=$(grep "^PRISMA_DATABASE_URL=" .env.production | cut -d '=' -f2- | tr -d '"')

    if [ -n "$PRISMA_DATABASE_URL" ]; then
        echo "📦 PRISMA_DATABASE_URLをVercelに設定中..."
        vercel env add PRISMA_DATABASE_URL production <<< "$PRISMA_DATABASE_URL"
        echo "✅ PRISMA_DATABASE_URLを設定しました"
    fi
else
    echo "❌ .env.productionファイルが見つかりません"
    echo ""
    echo "以下の手順で.env.productionを作成してください:"
    echo "1. Vercel Dashboardで新しいPostgreSQLデータベースを作成"
    echo "2. DATABASE_URLをコピー"
    echo "3. .env.productionファイルに貼り付け"
    exit 1
fi

echo ""
echo "🎉 環境変数の設定が完了しました！"
echo ""
echo "📝 次のステップ:"
echo "1. Vercel Dashboardで環境変数を確認:"
echo "   https://vercel.com/dashboard/settings/environment-variables"
echo ""
echo "2. デプロイを実行:"
echo "   vercel --prod"
echo ""
echo "3. または、Gitにpushしてデプロイ:"
echo "   git add ."
echo "   git commit -m 'fix: Add database migration to build'"
echo "   git push origin main"
