/**
 * データベースバックアップスクリプト
 * 既存のデータを安全にJSONファイルとしてエクスポートします
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function backupData() {
  try {
    console.log('📦 データベースバックアップを開始します...');

    // 記事データを取得
    const articles = await prisma.article.findMany({
      include: {
        memberships: {
          include: {
            membership: true,
          },
        },
      },
    });

    // メンバーシップデータを取得
    const memberships = await prisma.membership.findMany();

    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      articles: articles,
      memberships: memberships,
      stats: {
        articleCount: articles.length,
        membershipCount: memberships.length,
      },
    };

    // バックアップディレクトリを作成
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // タイムスタンプ付きでバックアップファイルを作成
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilePath = path.join(backupDir, `backup-${timestamp}.json`);

    fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2), 'utf-8');

    console.log('✅ バックアップ完了!');
    console.log(`📄 ファイル: ${backupFilePath}`);
    console.log(`📊 統計:`);
    console.log(`   - 記事数: ${articles.length}`);
    console.log(`   - メンバーシップ数: ${memberships.length}`);

    return backupData;
  } catch (error) {
    console.error('❌ バックアップエラー:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

backupData();
