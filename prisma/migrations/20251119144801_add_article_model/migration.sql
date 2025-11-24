-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rowNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "noteLink" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL,
    "characterCount" INTEGER NOT NULL,
    "estimatedReadTime" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "benefit" TEXT NOT NULL,
    "recommendationLevel" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_noteLink_key" ON "Article"("noteLink");

-- CreateIndex
CREATE INDEX "Article_noteLink_idx" ON "Article"("noteLink");

-- CreateIndex
CREATE INDEX "Article_publishedAt_idx" ON "Article"("publishedAt");

-- CreateIndex
CREATE INDEX "Article_genre_idx" ON "Article"("genre");
