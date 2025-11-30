const fs = require('fs');
const path = require('path');

console.log('🔧 Generating SQL import file...\n');

try {
    // Memberships
    console.log('📦 Processing memberships...');
    const membershipsData = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../data/memberships.json'), 'utf-8')
    );
    const memberships = membershipsData.memberships || membershipsData;

    let sql = '-- Memberships\n';
    let membershipCount = 0;

    memberships.forEach((m) => {
        const description = m.description ? `'${m.description.replace(/'/g, "''")}'` : 'NULL';
        const color = m.color ? `'${m.color}'` : 'NULL';

        sql += `INSERT INTO "Membership" (id, name, description, color, "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('${m.id}', '${m.name.replace(/'/g, "''")}', ${description}, ${color}, ${m.sortOrder}, ${m.isActive}, '${m.createdAt}', '${m.updatedAt}') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, color = EXCLUDED.color, "sortOrder" = EXCLUDED."sortOrder", "isActive" = EXCLUDED."isActive";\n`;
        membershipCount++;
    });

    console.log(`   ✅ ${membershipCount} memberships processed`);

    // Articles
    console.log('\n📄 Processing articles...');
    const articlesData = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../data/articles.json'), 'utf-8')
    );
    const articles = articlesData.articles;

    sql += '\n-- Articles\n';
    let articleCount = 0;
    let membershipLinkCount = 0;

    articles.forEach((a) => {
        const title = a.title.replace(/'/g, "''");
        const genre = a.genre.replace(/'/g, "''");
        const targetAudience = a.targetAudience.replace(/'/g, "''");
        const benefit = a.benefit.replace(/'/g, "''");
        const recommendationLevel = a.recommendationLevel.replace(/'/g, "''");

        sql += `INSERT INTO "Article" (id, "rowNumber", title, "noteLink", "publishedAt", "characterCount", "estimatedReadTime", genre, "targetAudience", benefit, "recommendationLevel", "createdAt", "updatedAt") VALUES ('${a.id}', ${a.rowNumber}, '${title}', '${a.noteLink}', '${a.publishedAt}', ${a.characterCount}, ${a.estimatedReadTime}, '${genre}', '${targetAudience}', '${benefit}', '${recommendationLevel}', '${a.createdAt}', '${a.updatedAt}') ON CONFLICT ("noteLink") DO UPDATE SET title = EXCLUDED.title, "rowNumber" = EXCLUDED."rowNumber", "publishedAt" = EXCLUDED."publishedAt", "characterCount" = EXCLUDED."characterCount", "estimatedReadTime" = EXCLUDED."estimatedReadTime", genre = EXCLUDED.genre, "targetAudience" = EXCLUDED."targetAudience", benefit = EXCLUDED.benefit, "recommendationLevel" = EXCLUDED."recommendationLevel";\n`;
        articleCount++;

        // Article Memberships
        if (a.membershipIds && a.membershipIds.length > 0) {
            a.membershipIds.forEach((mid) => {
                sql += `INSERT INTO "ArticleMembership" ("articleId", "membershipId") VALUES ('${a.id}', '${mid}') ON CONFLICT ("articleId", "membershipId") DO NOTHING;\n`;
                membershipLinkCount++;
            });
        }
    });

    console.log(`   ✅ ${articleCount} articles processed`);
    console.log(`   ✅ ${membershipLinkCount} article-membership links created`);

    const outputPath = path.join(__dirname, 'import.sql');
    fs.writeFileSync(outputPath, sql);

    console.log(`\n🎉 SQL file generated successfully!`);
    console.log(`   Location: ${outputPath}`);
    console.log(`\n📋 Summary:`);
    console.log(`   - ${membershipCount} memberships`);
    console.log(`   - ${articleCount} articles`);
    console.log(`   - ${membershipLinkCount} article-membership links`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Get your database URL from Vercel Dashboard`);
    console.log(`   2. Run: psql "YOUR_DATABASE_URL" -f scripts/import.sql`);
    console.log(`   Or use an online PostgreSQL client to execute the SQL file.`);

} catch (error) {
    console.error('❌ Error generating SQL:', error.message);
    process.exit(1);
}
