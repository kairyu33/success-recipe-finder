
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting data migration to Postgres...');

    // 1. Migrate Memberships
    console.log('\n📦 Migrating Memberships...');
    const membershipsPath = path.join(process.cwd(), 'data', 'memberships.json');

    if (fs.existsSync(membershipsPath)) {
        const membershipsFileData = JSON.parse(fs.readFileSync(membershipsPath, 'utf-8'));
        const membershipsData = membershipsFileData.memberships || membershipsFileData; // Handle both { memberships: [] } and direct array

        for (const m of membershipsData) {
            try {
                await prisma.membership.upsert({
                    where: { name: m.name },
                    update: {
                        description: m.description,
                        color: m.color,
                        sortOrder: m.sortOrder,
                        isActive: m.isActive,
                    },
                    create: {
                        id: m.id, // Keep original ID if possible, or let Prisma generate one if needed (but we want to preserve relationships)
                        name: m.name,
                        description: m.description,
                        color: m.color,
                        sortOrder: m.sortOrder,
                        isActive: m.isActive,
                        createdAt: new Date(m.createdAt),
                        updatedAt: new Date(m.updatedAt),
                    },
                });
                console.log(`   ✅ Imported membership: ${m.name}`);
            } catch (e) {
                console.error(`   ❌ Failed to import membership: ${m.name}`, e);
            }
        }
    } else {
        console.log('   ⚠️ No memberships.json found.');
    }

    // 2. Migrate Articles
    console.log('\n📄 Migrating Articles...');
    const articlesPath = path.join(process.cwd(), 'data', 'articles.json');

    if (fs.existsSync(articlesPath)) {
        const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
        const { articles } = articlesData; // articles.json structure is { articles: [], lastModified: ... }

        if (Array.isArray(articles)) {
            for (const a of articles) {
                try {
                    // Create article
                    const article = await prisma.article.upsert({
                        where: { noteLink: a.noteLink },
                        update: {
                            title: a.title,
                            publishedAt: new Date(a.publishedAt),
                            characterCount: a.characterCount,
                            estimatedReadTime: a.estimatedReadTime,
                            genre: a.genre,
                            targetAudience: a.targetAudience,
                            benefit: a.benefit,
                            recommendationLevel: a.recommendationLevel,
                        },
                        create: {
                            id: a.id,
                            rowNumber: a.rowNumber,
                            title: a.title,
                            noteLink: a.noteLink,
                            publishedAt: new Date(a.publishedAt),
                            characterCount: a.characterCount,
                            estimatedReadTime: a.estimatedReadTime,
                            genre: a.genre,
                            targetAudience: a.targetAudience,
                            benefit: a.benefit,
                            recommendationLevel: a.recommendationLevel,
                            createdAt: new Date(a.createdAt),
                            updatedAt: new Date(a.updatedAt),
                        },
                    });

                    // Link memberships
                    if (a.membershipIds && a.membershipIds.length > 0) {
                        // Clear existing links first to avoid duplicates/errors on re-run
                        await prisma.articleMembership.deleteMany({
                            where: { articleId: article.id }
                        });

                        for (const membershipId of a.membershipIds) {
                            // Verify membership exists first (since we might have skipped some or IDs might mismatch if not preserved)
                            // Actually, we tried to preserve IDs in step 1.
                            const membershipExists = await prisma.membership.findUnique({ where: { id: membershipId } });

                            if (membershipExists) {
                                await prisma.articleMembership.create({
                                    data: {
                                        articleId: article.id,
                                        membershipId: membershipId
                                    }
                                });
                            } else {
                                console.warn(`      ⚠️ Membership ID ${membershipId} not found for article ${a.title}`);
                            }
                        }
                    }

                    console.log(`   ✅ Imported article: ${a.title}`);
                } catch (e) {
                    console.error(`   ❌ Failed to import article: ${a.title}`, e);
                }
            }
        }
    } else {
        console.log('   ⚠️ No articles.json found.');
    }

    console.log('\n🎉 Migration completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
