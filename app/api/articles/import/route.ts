/**
 * CSV Import API Endpoint - File-based storage
 *
 * @description Handles CSV file upload and imports articles into JSON file storage
 * Ensures note links are unique and prevents duplicate entries
 */

import { NextRequest, NextResponse } from 'next/server';
import { bulkCreateArticles } from '@/lib/stores/articlesStore';

/**
 * Parse CSV data and extract article information with membership IDs
 */
function parseCSV(csvText: string): Array<{
  rowNumber: number;
  title: string;
  noteLink: string;
  publishedAt: string;
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
          publishedAt: new Date(fields[3]).toISOString(),
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
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
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
        { error: 'No valid articles found in CSV' },
        { status: 400 }
      );
    }

    // Import articles with duplicate checking
    const result = await bulkCreateArticles(articles);

    return NextResponse.json({
      success: true,
      total: articles.length,
      imported: result.imported,
      updated: result.updated,
      errors: result.errors.length > 0 ? result.errors : undefined
    });

  } catch (error) {
    console.error('CSV import error:', error);

    // Don't expose error details in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Failed to import CSV' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to import CSV', details: String(error) },
      { status: 500 }
    );
  }
}
