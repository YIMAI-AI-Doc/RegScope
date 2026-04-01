-- CreateTable
CREATE TABLE "DiscussionView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "discussionId" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastViewedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussionView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnswerVote" (
    "id" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnswerVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DiscussionView_userId_lastViewedAt_idx" ON "DiscussionView"("userId", "lastViewedAt");

-- CreateIndex
CREATE INDEX "DiscussionView_discussionId_lastViewedAt_idx" ON "DiscussionView"("discussionId", "lastViewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussionView_userId_discussionId_key" ON "DiscussionView"("userId", "discussionId");

-- CreateIndex
CREATE INDEX "AnswerVote_userId_updatedAt_idx" ON "AnswerVote"("userId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AnswerVote_answerId_userId_key" ON "AnswerVote"("answerId", "userId");

-- AddForeignKey
ALTER TABLE "DiscussionView" ADD CONSTRAINT "DiscussionView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionView" ADD CONSTRAINT "DiscussionView_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerVote" ADD CONSTRAINT "AnswerVote_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerVote" ADD CONSTRAINT "AnswerVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
