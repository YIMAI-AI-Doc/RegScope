import { prisma } from "@/lib/db";
import { type PetEventType, type PetGrowthStage, type PetTierSlug } from "./catalog";
import {
  getNextTierSlug,
  getPointsForEvent,
  getStageForPoints,
  hasReachedCommentDailyCap,
  hasReachedUpgrade,
  PET_COMMENT_DAILY_CAP,
  PET_TIER_MAX_POINTS,
} from "./scoring";

type PetTransaction = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

type PetProfileRecord = Awaited<ReturnType<typeof ensureUserPetProfile>>;

export type GrantPetPointsInput = {
  userId: string;
  eventType: PetEventType;
  sourceId?: string;
  sourceType?: string;
  randomFn?: () => number;
};

export type GrantPetPointsResult = {
  profile: PetProfileRecord;
  awardedPoints: number;
  didUpgrade: boolean;
  nextTierSlug: PetTierSlug | null;
  ignoredReason?: "duplicate" | "comment_cap";
};

function pickRandomSpecies<T>(items: readonly T[], randomFn: () => number) {
  const index = Math.max(0, Math.min(items.length - 1, Math.floor(randomFn() * items.length)));
  return items[index] ?? null;
}

async function getTierWithSpecies(tx: PetTransaction, slug: PetTierSlug) {
  return tx.petTier.findUnique({
    where: { slug },
    include: { species: true },
  });
}

async function ensureUserPetProfileTx(tx: PetTransaction, userId: string, randomFn: () => number) {
  const existing = await tx.userPetProfile.findUnique({
    where: { userId },
    include: {
      currentTier: true,
      currentSpecies: true,
    },
  });

  if (existing) {
    return existing;
  }

  const starterTier = await getTierWithSpecies(tx, "FANZAI");
  if (!starterTier || starterTier.species.length === 0) {
    throw new Error("PET_CATALOG_NOT_READY");
  }

  const starterSpecies = pickRandomSpecies(starterTier.species, randomFn);
  if (!starterSpecies) {
    throw new Error("PET_SPECIES_NOT_READY");
  }

  return tx.userPetProfile.create({
    data: {
      userId,
      currentTierId: starterTier.id,
      currentSpeciesId: starterSpecies.id,
      currentPoints: 0,
      currentStage: "BABY",
      totalPointsEarned: 0,
    },
    include: {
      currentTier: true,
      currentSpecies: true,
    },
  });
}

export async function ensureUserPetProfile(userId: string, randomFn: () => number = Math.random) {
  const existing = await prisma.userPetProfile.findUnique({
    where: { userId },
    include: {
      currentTier: true,
      currentSpecies: true,
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.$transaction((tx) => ensureUserPetProfileTx(tx, userId, randomFn));
}

export async function grantPetPoints({
  userId,
  eventType,
  sourceId,
  sourceType,
  randomFn = Math.random,
}: GrantPetPointsInput): Promise<GrantPetPointsResult> {
  return prisma.$transaction(async (tx) => {
    const profile = await ensureUserPetProfileTx(tx, userId, randomFn);

    const existingEvent =
      sourceId || sourceType
        ? await tx.userPetEvent.findFirst({
            where: {
              userId,
              eventType,
              sourceId: sourceId ?? null,
              sourceType: sourceType ?? null,
            },
          })
        : null;

    if (existingEvent) {
      return {
        profile,
        awardedPoints: 0,
        didUpgrade: false,
        nextTierSlug: getNextTierSlug(profile.currentTier.slug as PetTierSlug),
        ignoredReason: "duplicate",
      };
    }

    const rawPoints = getPointsForEvent(eventType);

    if (eventType === "COMMENT") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const todayCommentEvents = await tx.userPetEvent.findMany({
        where: {
          userId,
          eventType: "COMMENT",
          createdAt: { gte: startOfDay },
        },
        select: { points: true },
      });
      const todayCommentPoints = todayCommentEvents.reduce((total, item) => total + item.points, 0);

      if (hasReachedCommentDailyCap(todayCommentPoints)) {
        return {
          profile,
          awardedPoints: 0,
          didUpgrade: false,
          nextTierSlug: getNextTierSlug(profile.currentTier.slug as PetTierSlug),
          ignoredReason: "comment_cap",
        };
      }
    }

    const awardedPoints =
      eventType === "COMMENT"
        ? Math.min(
            rawPoints,
            Math.max(
              0,
              PET_COMMENT_DAILY_CAP -
                (
                  await tx.userPetEvent
                    .findMany({
                      where: {
                        userId,
                        eventType: "COMMENT",
                        createdAt: {
                          gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        },
                      },
                      select: { points: true },
                    })
                    .then((events) => events.reduce((total, item) => total + item.points, 0))
                ),
            ),
          )
        : rawPoints;

    if (awardedPoints <= 0) {
      return {
        profile,
        awardedPoints: 0,
        didUpgrade: false,
        nextTierSlug: getNextTierSlug(profile.currentTier.slug as PetTierSlug),
        ignoredReason: "comment_cap",
      };
    }

    await tx.userPetEvent.create({
      data: {
        userPetId: profile.id,
        userId,
        eventType,
        points: awardedPoints,
        sourceId: sourceId ?? null,
        sourceType: sourceType ?? null,
      },
    });

    const nextTierSlug = getNextTierSlug(profile.currentTier.slug as PetTierSlug);

    if (hasReachedUpgrade(profile.currentPoints + awardedPoints) && nextTierSlug) {
      const nextTier = await getTierWithSpecies(tx, nextTierSlug);
      if (!nextTier || nextTier.species.length === 0) {
        throw new Error("PET_NEXT_TIER_NOT_READY");
      }

      const nextSpecies = pickRandomSpecies(nextTier.species, randomFn);
      if (!nextSpecies) {
        throw new Error("PET_NEXT_SPECIES_NOT_READY");
      }

      const upgraded = await tx.userPetProfile.update({
        where: { id: profile.id },
        data: {
          currentTierId: nextTier.id,
          currentSpeciesId: nextSpecies.id,
          currentPoints: 0,
          currentStage: "BABY",
          totalPointsEarned: { increment: awardedPoints },
          lastUpgradeAt: new Date(),
        },
        include: {
          currentTier: true,
          currentSpecies: true,
        },
      });

      return {
        profile: upgraded,
        awardedPoints,
        didUpgrade: true,
        nextTierSlug: getNextTierSlug(upgraded.currentTier.slug as PetTierSlug),
      };
    }

    const nextPoints = Math.min(PET_TIER_MAX_POINTS, profile.currentPoints + awardedPoints);
    const nextStage = getStageForPoints(nextPoints) as PetGrowthStage;
    const updated = await tx.userPetProfile.update({
      where: { id: profile.id },
      data: {
        currentPoints: nextPoints,
        currentStage: nextStage,
        totalPointsEarned: { increment: awardedPoints },
      },
      include: {
        currentTier: true,
        currentSpecies: true,
      },
    });

    return {
      profile: updated,
      awardedPoints,
      didUpgrade: false,
      nextTierSlug,
    };
  });
}
