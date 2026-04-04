-- CreateEnum
CREATE TYPE "PetTierSlug" AS ENUM ('FANZAI', 'MENGLING', 'ZHENCHONG', 'LINGZUN', 'SHENSHOU');

-- CreateEnum
CREATE TYPE "PetGrowthStage" AS ENUM ('BABY', 'GROWING', 'MATURE');

-- CreateEnum
CREATE TYPE "PetEventType" AS ENUM ('DAILY_QUESTION', 'COMMENT', 'ARTICLE', 'DISCUSSION_POST');

-- CreateTable
CREATE TABLE "PetTier" (
    "id" TEXT NOT NULL,
    "slug" "PetTierSlug" NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "PetTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetSpecies" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "motionPreset" TEXT NOT NULL,
    "visualStyle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "traitKeywords" TEXT[],
    "growthStageConfig" JSONB NOT NULL,

    CONSTRAINT "PetSpecies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPetProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentTierId" TEXT NOT NULL,
    "currentSpeciesId" TEXT NOT NULL,
    "currentPoints" INTEGER NOT NULL DEFAULT 0,
    "currentStage" "PetGrowthStage" NOT NULL DEFAULT 'BABY',
    "totalPointsEarned" INTEGER NOT NULL DEFAULT 0,
    "lastUpgradeAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPetProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPetEvent" (
    "id" TEXT NOT NULL,
    "userPetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" "PetEventType" NOT NULL,
    "points" INTEGER NOT NULL,
    "sourceId" TEXT,
    "sourceType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPetEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PetTier_slug_key" ON "PetTier"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PetTier_sortOrder_key" ON "PetTier"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "PetSpecies_slug_key" ON "PetSpecies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "UserPetProfile_userId_key" ON "UserPetProfile"("userId");

-- CreateIndex
CREATE INDEX "UserPetProfile_currentTierId_idx" ON "UserPetProfile"("currentTierId");

-- CreateIndex
CREATE INDEX "UserPetProfile_currentSpeciesId_idx" ON "UserPetProfile"("currentSpeciesId");

-- CreateIndex
CREATE INDEX "UserPetEvent_userId_createdAt_idx" ON "UserPetEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "UserPetEvent_eventType_createdAt_idx" ON "UserPetEvent"("eventType", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserPetEvent_userId_eventType_sourceId_sourceType_key" ON "UserPetEvent"("userId", "eventType", "sourceId", "sourceType");

-- AddForeignKey
ALTER TABLE "PetSpecies" ADD CONSTRAINT "PetSpecies_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "PetTier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPetProfile" ADD CONSTRAINT "UserPetProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPetProfile" ADD CONSTRAINT "UserPetProfile_currentTierId_fkey" FOREIGN KEY ("currentTierId") REFERENCES "PetTier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPetProfile" ADD CONSTRAINT "UserPetProfile_currentSpeciesId_fkey" FOREIGN KEY ("currentSpeciesId") REFERENCES "PetSpecies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPetEvent" ADD CONSTRAINT "UserPetEvent_userPetId_fkey" FOREIGN KEY ("userPetId") REFERENCES "UserPetProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPetEvent" ADD CONSTRAINT "UserPetEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
