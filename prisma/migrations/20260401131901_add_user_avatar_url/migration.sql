-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT;

-- CreateTable
CREATE TABLE "ContentFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussionFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "discussionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscussionFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContentFavorite_userId_createdAt_idx" ON "ContentFavorite"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ContentFavorite_contentId_createdAt_idx" ON "ContentFavorite"("contentId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ContentFavorite_userId_contentId_key" ON "ContentFavorite"("userId", "contentId");

-- CreateIndex
CREATE INDEX "DiscussionFavorite_userId_createdAt_idx" ON "DiscussionFavorite"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "DiscussionFavorite_discussionId_createdAt_idx" ON "DiscussionFavorite"("discussionId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussionFavorite_userId_discussionId_key" ON "DiscussionFavorite"("userId", "discussionId");

-- AddForeignKey
ALTER TABLE "ContentFavorite" ADD CONSTRAINT "ContentFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentFavorite" ADD CONSTRAINT "ContentFavorite_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "ContentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionFavorite" ADD CONSTRAINT "DiscussionFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionFavorite" ADD CONSTRAINT "DiscussionFavorite_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
