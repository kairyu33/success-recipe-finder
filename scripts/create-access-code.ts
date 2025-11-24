/**
 * アクセスコード作成スクリプト
 * note.com購読者向けのアクセスコードを生成します
 *
 * 使い方:
 * 1. ローカル開発環境:
 *    npx tsx scripts/create-access-code.ts
 *
 * 2. 本番環境:
 *    DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')" \
 *    npx tsx scripts/create-access-code.ts
 */

import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';

const prisma = new PrismaClient();

interface AccessCodeInput {
  code?: string;
  plan: 'free' | 'basic' | 'pro' | 'unlimited';
  monthlyLimit: number;
  expiresAt?: Date;
  noteUserId?: string;
  noteUrl?: string;
}

// ランダムなアクセスコードを生成
function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 似た文字を除外
  const segments = 3;
  const segmentLength = 5;

  const code = Array.from({ length: segments }, () => {
    return Array.from({ length: segmentLength }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }).join('-');

  return `NOTE-${code}`;
}

// ユーザー入力を受け取る
function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function createAccessCode() {
  try {
    console.log('🎫 アクセスコード作成ツール\n');

    // プラン選択
    console.log('プランを選択してください:');
    console.log('1. free (月5回まで)');
    console.log('2. basic (月30回まで)');
    console.log('3. pro (月100回まで)');
    console.log('4. unlimited (無制限)');

    const planChoice = await askQuestion('\nプラン番号を入力 (1-4): ');

    const planMap: { [key: string]: AccessCodeInput } = {
      '1': { plan: 'free', monthlyLimit: 5 },
      '2': { plan: 'basic', monthlyLimit: 30 },
      '3': { plan: 'pro', monthlyLimit: 100 },
      '4': { plan: 'unlimited', monthlyLimit: 999999 },
    };

    const selectedPlan = planMap[planChoice];
    if (!selectedPlan) {
      throw new Error('無効なプランです');
    }

    // アクセスコード生成
    const code = generateAccessCode();
    console.log(`\n✨ 生成されたアクセスコード: ${code}`);

    // note.com情報（オプション）
    const noteUrl = await askQuestion('\nnote.com記事URL (オプション、Enterでスキップ): ');
    const noteUserId = await askQuestion('note.comユーザーID (オプション、Enterでスキップ): ');

    // 有効期限（オプション）
    const expireAnswer = await askQuestion('\n有効期限を設定しますか？ (y/N): ');
    let expiresAt: Date | undefined;

    if (expireAnswer.toLowerCase() === 'y') {
      const days = await askQuestion('有効日数を入力 (例: 365): ');
      const daysNumber = parseInt(days, 10);
      if (!isNaN(daysNumber) && daysNumber > 0) {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + daysNumber);
      }
    }

    // データベースに保存
    console.log('\n💾 データベースに保存しています...');

    const accessCode = await prisma.accessCode.create({
      data: {
        code,
        plan: selectedPlan.plan,
        status: 'active',
        monthlyLimit: selectedPlan.monthlyLimit,
        expiresAt: expiresAt || null,
        noteUrl: noteUrl || null,
        noteUserId: noteUserId || null,
      },
    });

    console.log('\n✅ アクセスコード作成完了!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📋 アクセスコード詳細`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`コード: ${accessCode.code}`);
    console.log(`プラン: ${accessCode.plan}`);
    console.log(`月間上限: ${accessCode.monthlyLimit}回`);
    console.log(`ステータス: ${accessCode.status}`);

    if (accessCode.expiresAt) {
      console.log(`有効期限: ${accessCode.expiresAt.toLocaleDateString('ja-JP')}`);
    } else {
      console.log(`有効期限: 無期限`);
    }

    if (accessCode.noteUrl) {
      console.log(`note記事: ${accessCode.noteUrl}`);
    }
    if (accessCode.noteUserId) {
      console.log(`noteユーザーID: ${accessCode.noteUserId}`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 配布用テキスト
    console.log('📝 note.com購読者向け配布テキスト:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('## 🎁 Success Recipe Finderへのアクセス\n');
    console.log(`あなた専用のアクセスコード: **${accessCode.code}**\n`);
    console.log('### アクセス方法');
    console.log('1. https://note-article-manager-260tjzsa7-kairyu33s-projects.vercel.app にアクセス');
    console.log('2. 上記のアクセスコードを入力');
    console.log('3. 571件の成功レシピ記事を検索・閲覧\n');
    console.log('### 利用制限');
    console.log(`- プラン: ${accessCode.plan}`);
    console.log(`- 月間利用回数: ${accessCode.monthlyLimit}回`);

    if (accessCode.expiresAt) {
      console.log(`- 有効期限: ${accessCode.expiresAt.toLocaleDateString('ja-JP')}まで`);
    } else {
      console.log(`- 有効期限: 無期限`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// バッチモード（環境変数から設定）
async function createAccessCodeBatch() {
  const code = process.env.ACCESS_CODE || generateAccessCode();
  const plan = (process.env.ACCESS_PLAN || 'pro') as 'free' | 'basic' | 'pro' | 'unlimited';
  const monthlyLimit = parseInt(process.env.MONTHLY_LIMIT || '100', 10);
  const noteUrl = process.env.NOTE_URL;
  const noteUserId = process.env.NOTE_USER_ID;

  let expiresAt: Date | undefined;
  if (process.env.EXPIRES_DAYS) {
    const days = parseInt(process.env.EXPIRES_DAYS, 10);
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);
  }

  try {
    const accessCode = await prisma.accessCode.create({
      data: {
        code,
        plan,
        status: 'active',
        monthlyLimit,
        expiresAt: expiresAt || null,
        noteUrl: noteUrl || null,
        noteUserId: noteUserId || null,
      },
    });

    console.log('✅ アクセスコード作成完了!');
    console.log(JSON.stringify(accessCode, null, 2));
  } catch (error) {
    console.error('❌ エラー:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// バッチモードの判定
if (process.env.BATCH_MODE === 'true') {
  createAccessCodeBatch();
} else {
  createAccessCode();
}
