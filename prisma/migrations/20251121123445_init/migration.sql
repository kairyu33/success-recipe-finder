-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ArticleMembership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "articleId" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ArticleMembership_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArticleMembership_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Membership_name_key" ON "Membership"("name");

-- CreateIndex
CREATE INDEX "Membership_name_idx" ON "Membership"("name");

-- CreateIndex
CREATE INDEX "Membership_sortOrder_idx" ON "Membership"("sortOrder");

-- CreateIndex
CREATE INDEX "ArticleMembership_articleId_idx" ON "ArticleMembership"("articleId");

-- CreateIndex
CREATE INDEX "ArticleMembership_membershipId_idx" ON "ArticleMembership"("membershipId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleMembership_articleId_membershipId_key" ON "ArticleMembership"("articleId", "membershipId");
