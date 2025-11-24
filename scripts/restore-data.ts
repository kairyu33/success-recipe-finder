/**
 * データベース復元スクリプト
 * バックアップファイルから本番環境にデータをインポートします
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function restoreData(backupFilePath?: string) {
  try {
    console.log('📥 データベース復元を開始します...');

    // バックアップファイルを特定
    let filePath = backupFilePath;

    if (!filePath) {
      // 最新のバックアップファイルを自動選択
      const backupDir = path.join(process.cwd(), 'backups');
      const files = fs.readdirSync(backupDir)
        .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
        .sort()
        .reverse();

      if (files.length === 0) {
        throw new Error('バックアップファイルが見つかりません');
      }

      filePath = path.join(backupDir, files[0]);
      console.log(`📄 使用するバックアップ: ${files[0]}`);
    }

    // バックアップファイルを読み込み
    const backupData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    console.log(`📊 バックアップ情報:`);
    console.log(`   - 作成日時: ${backupData.timestamp}`);
    console.log(`   - 記事数: ${backupData.stats.articleCount}`);
    console.log(`   - メンバーシップ数: ${backupData.stats.membershipCount}`);

    // 既存データの確認
    const existingArticles = await prisma.article.count();
    const existingMemberships = await prisma.membership.count();

    console.log(`\n📋 現在のデータベース:`);
    console.log(`   - 記事数: ${existingArticles}`);
    console.log(`   - メンバーシップ数: ${existingMemberships}`);

    if (existingArticles > 0 || existingMemberships > 0) {
      console.log('\n⚠️  警告: データベースに既存データがあります');
      console.log('   復元を続行すると、重複データが作成される可能性があります');
      console.log('   続行する場合は環境変数 FORCE_RESTORE=true を設定してください');

      if (process.env.FORCE_RESTORE !== 'true') {
        console.log('❌ 復元を中止しました');
        return;
      }
    }

    console.log('\n🔄 データを復元しています...');

    // メンバーシップを復元
    if (backupData.memberships && backupData.memberships.length > 0) {
      console.log('   メンバーシップを復元中...');
      for (const membership of backupData.memberships) {
        await prisma.membership.upsert({
          where: { id: membership.id },
          create: {
            id: membership.id,
            name: membership.name,
            description: membership.description,
            color: membership.color,
            sortOrder: membership.sortOrder,
            isActive: membership.isActive,
          },
          update: {
            name: membership.name,
            description: membership.description,
            color: membership.color,
            sortOrder: membership.sortOrder,
            isActive: membership.isActive,
          },
        });
      }
      console.log(`   ✅ ${backupData.memberships.length}件のメンバーシップを復元`);
    }

    // 記事を復元
    if (backupData.articles && backupData.articles.length > 0) {
      console.log('   記事を復元中...');
      let restoredCount = 0;

      for (const article of backupData.articles) {
        await prisma.article.upsert({
          where: { noteLink: article.noteLink },
          create: {
            id: article.id,
            rowNumber: article.rowNumber,
            title: article.title,
            noteLink: article.noteLink,
            publishedAt: new Date(article.publishedAt),
            characterCount: article.characterCount,
            estimatedReadTime: article.estimatedReadTime,
            genre: article.genre,
            targetAudience: article.targetAudience,
            benefit: article.benefit,
            recommendationLevel: article.recommendationLevel,
          },
          update: {
            title: article.title,
            rowNumber: article.rowNumber,
            publishedAt: new Date(article.publishedAt),
            characterCount: article.characterCount,
            estimatedReadTime: article.estimatedReadTime,
            genre: article.genre,
            targetAudience: article.targetAudience,
            benefit: article.benefit,
            recommendationLevel: article.recommendationLevel,
          },
        });

        restoredCount++;
        if (restoredCount % 50 === 0) {
          console.log(`   進捗: ${restoredCount}/${backupData.articles.length}`);
        }
      }

      console.log(`   ✅ ${restoredCount}件の記事を復元`);
    }

    console.log('\n✅ データベース復元が完了しました!');

    // 復元後の統計
    const finalArticles = await prisma.article.count();
    const finalMemberships = await prisma.membership.count();

    console.log(`\n📊 復元後の統計:`);
    console.log(`   - 記事数: ${finalArticles}`);
    console.log(`   - メンバーシップ数: ${finalMemberships}`);

  } catch (error) {
    console.error('❌ 復元エラー:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// コマンドライン引数からバックアップファイルパスを取得
const backupFile = process.argv[2];
restoreData(backupFile);
