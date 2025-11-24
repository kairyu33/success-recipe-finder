/**
 * Test script for comprehensive article analysis
 *
 * @description Tests the /api/analyze-article-full endpoint with sample article text
 * Run with: npx tsx test-analysis.ts (requires tsx to be installed)
 */

const SAMPLE_ARTICLE = `
Claude AIを使った最新のアプリケーション開発

今日は、Anthropic社が提供するClaude AIを使って、note.com向けの記事分析ツールを開発しました。このツールは、記事のテキストを入力するだけで、ハッシュタグの生成、タイトル案の提案、学習ポイントの抽出、ターゲット読者の特定、そしてアイキャッチ画像のアイデアまで自動で生成してくれます。

開発に使用した技術スタックは以下の通りです：
- Next.js 16（React 19）
- TypeScript（型安全性の確保）
- Tailwind CSS 4（モダンなUI）
- Anthropic Claude 3.5 Sonnet（AI分析）

特に印象的だったのは、Claude APIの応答品質の高さです。単なるキーワード抽出ではなく、記事の文脈を深く理解した上で、実用的な提案を生成してくれます。

開発者の皆さんにとって、このツールは記事作成の効率を大幅に向上させることができます。タイトルに悩む時間、適切なハッシュタグを考える時間、アイキャッチ画像のコンセプトを練る時間、これらすべてをAIが数秒で処理してくれます。

ぜひ、皆さんも自分のnote記事で試してみてください。
`;

interface AnalysisResponse {
  suggestedTitles?: string[];
  insights?: {
    whatYouLearn?: string[];
    benefits?: string[];
    recommendedFor?: string[];
    oneLiner?: string;
  };
  eyeCatchImage?: {
    mainPrompt?: string;
    compositionIdeas?: string[];
    colorPalette?: string[];
    mood?: string;
    style?: string;
    summary?: string;
  };
  hashtags?: string[];
  error?: string;
}

async function testAnalysis() {
  console.log('🚀 Testing Comprehensive Article Analysis...\n');
  console.log('📝 Article Length:', SAMPLE_ARTICLE.length, 'characters\n');

  const startTime = Date.now();

  try {
    const response = await fetch('http://localhost:3000/api/analyze-article-full', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ articleText: SAMPLE_ARTICLE }),
    });

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error:', error.error);
      return;
    }

    const data: AnalysisResponse = await response.json();

    console.log('✅ Analysis Complete!');
    console.log('⏱️  Duration:', duration, 'seconds\n');
    console.log('═'.repeat(80));

    // Display suggested titles
    if (data.suggestedTitles && data.suggestedTitles.length > 0) {
      console.log('\n📌 SUGGESTED TITLES:');
      data.suggestedTitles.forEach((title, i) => {
        console.log(`   ${i + 1}. ${title}`);
      });
    }

    // Display insights
    if (data.insights) {
      if (data.insights.oneLiner) {
        console.log('\n💡 ONE-LINER:');
        console.log(`   "${data.insights.oneLiner}"`);
      }

      if (data.insights.whatYouLearn && data.insights.whatYouLearn.length > 0) {
        console.log('\n🎓 WHAT YOU\'LL LEARN:');
        data.insights.whatYouLearn.forEach((item, i) => {
          console.log(`   ${i + 1}. ${item}`);
        });
      }

      if (data.insights.benefits && data.insights.benefits.length > 0) {
        console.log('\n✨ BENEFITS:');
        data.insights.benefits.forEach((item, i) => {
          console.log(`   ${i + 1}. ${item}`);
        });
      }

      if (data.insights.recommendedFor && data.insights.recommendedFor.length > 0) {
        console.log('\n👥 RECOMMENDED FOR:');
        data.insights.recommendedFor.forEach((item, i) => {
          console.log(`   ${i + 1}. ${item}`);
        });
      }
    }

    // Display eye-catch image info
    if (data.eyeCatchImage) {
      console.log('\n🎨 EYE-CATCH IMAGE:');

      if (data.eyeCatchImage.summary) {
        console.log(`   Summary: ${data.eyeCatchImage.summary}`);
      }

      if (data.eyeCatchImage.mood) {
        console.log(`   Mood: ${data.eyeCatchImage.mood}`);
      }

      if (data.eyeCatchImage.style) {
        console.log(`   Style: ${data.eyeCatchImage.style}`);
      }

      if (data.eyeCatchImage.colorPalette && data.eyeCatchImage.colorPalette.length > 0) {
        console.log(`   Colors: ${data.eyeCatchImage.colorPalette.join(', ')}`);
      }

      if (data.eyeCatchImage.mainPrompt) {
        console.log('\n   AI Image Prompt:');
        console.log(`   "${data.eyeCatchImage.mainPrompt}"`);
      }
    }

    // Display hashtags
    if (data.hashtags && data.hashtags.length > 0) {
      console.log('\n#️⃣ HASHTAGS:', `(${data.hashtags.length} total)`);
      const rows = [];
      for (let i = 0; i < data.hashtags.length; i += 4) {
        rows.push(data.hashtags.slice(i, i + 4));
      }
      rows.forEach(row => {
        console.log(`   ${row.join('  ')}`);
      });
    }

    console.log('\n' + '═'.repeat(80));
    console.log('\n✅ Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
console.log('Starting test...');
console.log('Make sure the dev server is running: npm run dev\n');

testAnalysis();
