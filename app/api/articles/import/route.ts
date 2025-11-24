/**
 * CSV Import API Endpoint
 *
 * @description Handles CSV file upload and imports articles into the database with membership associations
 * Ensures note links are unique and prevents duplicate entries (differential import)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Parse CSV data and extract article information with membership IDs
 *
 * @param csvText - CSV file content as text
 * @returns Array of article objects with membership IDs
 */
function parseCSV(csvText: string): Array<{
  rowNumber: number;
  title: string;
  noteLink: string;
  publishedAt: Date;
  characterCount: number;
  estimatedReadTime: number;
  genre: string;
  targetAudience: string;
  benefit: string;
  recommendationLevel: string;
  membershipIds: string[];
}> {
  const lines = csvText.split('\n').filter(line => line.trim());
  const articles = [];

  // Skip header row (index 0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    // Parse CSV line considering quoted fields
    const fields: string[] = [];
    let currentField = '';
    let insideQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        fields.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    fields.push(currentField.trim()); // Add last field

    if (fields.length >= 10) {
      try {
        // Parse membership IDs (semicolon-separated)
        const membershipIdsString = fields[10] || '';
        const membershipIds = membershipIdsString
          .split(';')
          .map(id => id.trim())
          .filter(id => id.length > 0);

        const article = {
          rowNumber: parseInt(fields[0]) || 0,
          title: fields[1],
          noteLink: fields[2],
          publishedAt: new Date(fields[3]),
          characterCount: parseInt(fields[4]) || 0,
          estimatedReadTime: parseInt(fields[5]) || 0,
          genre: fields[6] || '',
          targetAudience: fields[7] || '',
          benefit: fields[8] || '',
          recommendationLevel: fields[9] || '',
          membershipIds,
        };

        // Validate required fields
        if (article.noteLink && article.title) {
          articles.push(article);
        }
      } catch (error) {
        console.error(`Error parsing line ${i + 1}:`, error);
      }
    }
  }

  return articles;
}

/**
 * POST /api/articles/import
 *
 * @description Import articles from CSV file
 * Performs differential import - skips duplicate entries based on noteLink
 * Automatically creates article-membership associations
 *
 * @returns JSON response with import statistics (imported, skipped, errors)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが指定されていません' },
        { status: 400 }
      );
    }

    // Read file content
    const text = await file.text();

    // Remove BOM if present
    const cleanText = text.replace(/^\uFEFF/, '');

    // Parse CSV
    const articles = parseCSV(cleanText);

    if (articles.length === 0) {
      return NextResponse.json(
        { error: 'CSVに有効な記事データが見つかりませんでした' },
        { status: 400 }
      );
    }

    // Import articles with differential checking
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const articleData of articles) {
      try {
        // Check if article already exists (differential import)
        const existing = await prisma.article.findUnique({
          where: { noteLink: articleData.noteLink }
        });

        if (existing) {
          skipped++;
          continue; // Skip duplicate
        }

        // Extract membership IDs
        const { membershipIds, ...articleFields } = articleData;

        // Create new article
        const article = await prisma.article.create({
          data: articleFields
        });

        // Create article-membership associations if membership IDs are provided
        if (membershipIds.length > 0) {
          // Validate membership IDs exist
          const validMemberships = await prisma.membership.findMany({
            where: {
              id: {
                in: membershipIds
              }
            },
            select: { id: true }
          });

          const validMembershipIds = validMemberships.map(m => m.id);

          // Create associations only for valid membership IDs
          if (validMembershipIds.length > 0) {
            await prisma.articleMembership.createMany({
              data: validMembershipIds.map(membershipId => ({
                articleId: article.id,
                membershipId,
              })),
            });
          }

          // Warn about invalid membership IDs
          const invalidIds = membershipIds.filter(id => !validMembershipIds.includes(id));
          if (invalidIds.length > 0) {
            errors.push(`記事「${article.title}」: 無効なメンバーシップID: ${invalidIds.join(', ')}`);
          }
        }

        imported++;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        errors.push(`「${articleData.title}」のインポートに失敗: ${errorMsg}`);
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      total: articles.length,
      imported,
      skipped,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('CSV import error:', error);

    const errorMsg = error instanceof Error ? error.message : String(error);

    // Don't expose detailed error in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'CSVのインポートに失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'CSVのインポートに失敗しました', details: errorMsg },
      { status: 500 }
    );
  }
}
