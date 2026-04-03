-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "sourceNumber" INTEGER NOT NULL,
    "typeLabel" TEXT NOT NULL,
    "difficultyLabel" TEXT,
    "prompt" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "correctOption" TEXT NOT NULL,
    "legalBasis" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyQuizAssignment" (
    "id" TEXT NOT NULL,
    "dateKey" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyQuizAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyQuizResponse" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "selectedOption" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyQuizResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizQuestion_sequence_key" ON "QuizQuestion"("sequence");

-- CreateIndex
CREATE UNIQUE INDEX "QuizQuestion_sourceNumber_key" ON "QuizQuestion"("sourceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DailyQuizAssignment_dateKey_key" ON "DailyQuizAssignment"("dateKey");

-- CreateIndex
CREATE INDEX "DailyQuizAssignment_sequence_idx" ON "DailyQuizAssignment"("sequence");

-- CreateIndex
CREATE UNIQUE INDEX "DailyQuizResponse_assignmentId_userId_key" ON "DailyQuizResponse"("assignmentId", "userId");

-- CreateIndex
CREATE INDEX "DailyQuizResponse_userId_createdAt_idx" ON "DailyQuizResponse"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "DailyQuizResponse_assignmentId_createdAt_idx" ON "DailyQuizResponse"("assignmentId", "createdAt");

-- AddForeignKey
ALTER TABLE "DailyQuizAssignment" ADD CONSTRAINT "DailyQuizAssignment_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyQuizResponse" ADD CONSTRAINT "DailyQuizResponse_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "DailyQuizAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyQuizResponse" ADD CONSTRAINT "DailyQuizResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
