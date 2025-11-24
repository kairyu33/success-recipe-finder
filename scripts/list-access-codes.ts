/**
 * アクセスコード一覧表示スクリプト
 * 登録されているすべてのアクセスコードを表示します
 *
 * 使い方:
 * 1. ローカル開発環境:
 *    npx tsx scripts/list-access-codes.ts
 *
 * 2. 本番環境:
 *    DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')" \
 *    npx tsx scripts/list-access-codes.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function formatDate(date: Date | null): string {
  if (!date) return '無期限';
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function getStatusEmoji(status: string): string {
  switch (status) {
    case 'active':
      return '✅';
    case 'expired':
      return '⏰';
    case 'revoked':
      return '❌';
    default:
      return '❓';
  }
}

function getPlanLabel(plan: string): string {
  switch (plan) {
    case 'free':
      return 'Free（月5回）';
    case 'basic':
      return 'Basic（月30回）';
    case 'pro':
      return 'Pro（月100回）';
    case 'unlimited':
      return 'Unlimited（無制限）';
    default:
      return plan;
  }
}

async function listAccessCodes() {
  try {
    console.log('📋 アクセスコード一覧\n');

    // すべてのアクセスコードを取得
    const accessCodes = await prisma.accessCode.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            usageLogs: true,
          },
        },
      },
    });

    if (accessCodes.length === 0) {
      console.log('⚠️  登録されているアクセスコードがありません\n');
      console.log('アクセスコードを作成するには:');
      console.log('  npx tsx scripts/create-access-code.ts\n');
      return;
    }

    console.log(`合計: ${accessCodes.length}件\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // ステータスごとに集計
    const statusCounts = {
      active: 0,
      expired: 0,
      revoked: 0,
    };

    accessCodes.forEach((code) => {
      if (code.status === 'active') statusCounts.active++;
      else if (code.status === 'expired') statusCounts.expired++;
      else if (code.status === 'revoked') statusCounts.revoked++;
    });

    console.log(`ステータス別: 有効 ${statusCounts.active}件 | 期限切れ ${statusCounts.expired}件 | 無効 ${statusCounts.revoked}件\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 各アクセスコードを表示
    accessCodes.forEach((code, index) => {
      const statusEmoji = getStatusEmoji(code.status);
      const planLabel = getPlanLabel(code.plan);
      const expiryDate = formatDate(code.expiresAt);
      const lastUsed = code.lastUsedAt
        ? formatDate(code.lastUsedAt)
        : '未使用';
      const usageCount = code._count.usageLogs;

      console.log(`${index + 1}. ${statusEmoji} ${code.code}`);
      console.log(`   プラン: ${planLabel}`);
      console.log(`   ステータス: ${code.status}`);
      console.log(`   有効期限: ${expiryDate}`);
      console.log(`   最終使用: ${lastUsed}`);
      console.log(`   使用回数: ${usageCount}回`);

      if (code.noteUrl) {
        console.log(`   note記事: ${code.noteUrl}`);
      }
      if (code.noteUserId) {
        console.log(`   noteユーザーID: ${code.noteUserId}`);
      }

      console.log(`   作成日: ${formatDate(code.createdAt)}`);
      console.log('');
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // プラン別集計
    console.log('\n📊 プラン別統計:\n');
    const planCounts: { [key: string]: number } = {};
    accessCodes.forEach((code) => {
      planCounts[code.plan] = (planCounts[code.plan] || 0) + 1;
    });

    Object.entries(planCounts).forEach(([plan, count]) => {
      console.log(`   ${getPlanLabel(plan)}: ${count}件`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 有効期限が近いコードを警告
    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const expiringSoon = accessCodes.filter((code) => {
      if (!code.expiresAt || code.status !== 'active') return false;
      return code.expiresAt <= thirtyDaysLater && code.expiresAt > now;
    });

    if (expiringSoon.length > 0) {
      console.log('⚠️  有効期限が30日以内のコード:\n');
      expiringSoon.forEach((code) => {
        const daysLeft = Math.ceil(
          (code.expiresAt!.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
        );
        console.log(`   ${code.code}: あと${daysLeft}日（${formatDate(code.expiresAt)}）`);
      });
      console.log('');
    }

    // 使用頻度の高いコードを表示
    const mostUsed = [...accessCodes]
      .sort((a, b) => b._count.usageLogs - a._count.usageLogs)
      .slice(0, 5);

    if (mostUsed.length > 0 && mostUsed[0]._count.usageLogs > 0) {
      console.log('🔥 使用頻度TOP5:\n');
      mostUsed.forEach((code, index) => {
        if (code._count.usageLogs > 0) {
          console.log(`   ${index + 1}. ${code.code}: ${code._count.usageLogs}回`);
        }
      });
      console.log('');
    }

    // JSON出力オプション
    if (process.env.JSON_OUTPUT === 'true') {
      console.log('\n📄 JSON出力:\n');
      console.log(JSON.stringify(accessCodes, null, 2));
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 特定のステータスでフィルター
async function listByStatus(status: string) {
  try {
    const accessCodes = await prisma.accessCode.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`\n📋 ステータス: ${status} のアクセスコード（${accessCodes.length}件）\n`);

    if (accessCodes.length === 0) {
      console.log(`   該当するアクセスコードがありません\n`);
      return;
    }

    accessCodes.forEach((code, index) => {
      console.log(`${index + 1}. ${code.code}`);
      console.log(`   プラン: ${getPlanLabel(code.plan)}`);
      console.log(`   有効期限: ${formatDate(code.expiresAt)}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ エラー:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// コマンドライン引数で動作を変更
const args = process.argv.slice(2);
const command = args[0];

if (command === 'active') {
  listByStatus('active');
} else if (command === 'expired') {
  listByStatus('expired');
} else if (command === 'revoked') {
  listByStatus('revoked');
} else if (command === 'help' || command === '-h' || command === '--help') {
  console.log(`
📋 アクセスコード一覧表示ツール

使い方:
  npx tsx scripts/list-access-codes.ts [コマンド]

コマンド:
  (なし)   すべてのアクセスコードを表示（デフォルト）
  active   有効なアクセスコードのみ表示
  expired  期限切れのアクセスコードのみ表示
  revoked  無効化されたアクセスコードのみ表示
  help     このヘルプを表示

環境変数:
  JSON_OUTPUT=true  JSON形式で出力

例:
  # すべてのコードを表示
  npx tsx scripts/list-access-codes.ts

  # 有効なコードのみ表示
  npx tsx scripts/list-access-codes.ts active

  # 本番環境のコードを表示
  DATABASE_URL="..." npx tsx scripts/list-access-codes.ts

  # JSON形式で出力
  JSON_OUTPUT=true npx tsx scripts/list-access-codes.ts
`);
} else {
  listAccessCodes();
}
