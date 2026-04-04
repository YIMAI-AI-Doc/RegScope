import { getTierByOrder, petTiers, type PetEventType, type PetGrowthStage, type PetTierSlug } from "./catalog";

export const PET_TIER_MAX_POINTS = 15;
export const PET_STAR_POINTS = 5;
export const PET_COMMENT_DAILY_CAP = 3;

export function getPointsForEvent(eventType: PetEventType) {
  const table: Record<PetEventType, number> = {
    DAILY_QUESTION: 1,
    COMMENT: 1,
    ARTICLE: 3,
    DISCUSSION_POST: 2,
  };

  return table[eventType];
}

export function getStageForPoints(points: number): PetGrowthStage {
  if (points >= 10) {
    return "MATURE";
  }
  if (points >= 5) {
    return "GROWING";
  }
  return "BABY";
}

export function getPointsRemaining(points: number) {
  return Math.max(0, PET_TIER_MAX_POINTS - points);
}

export function getNextTierSlug(currentTierSlug: PetTierSlug): PetTierSlug | null {
  const current = petTiers.find((item) => item.slug === currentTierSlug);
  if (!current) {
    return null;
  }

  return getTierByOrder(current.sortOrder + 1)?.slug ?? null;
}

export function getStarFill(points: number) {
  return [0, 1, 2].map((index) => {
    const lowerBound = index * PET_STAR_POINTS;
    const current = Math.max(0, Math.min(PET_STAR_POINTS, points - lowerBound));
    return current / PET_STAR_POINTS;
  });
}

export function hasReachedUpgrade(points: number) {
  return points >= PET_TIER_MAX_POINTS;
}

export function hasReachedCommentDailyCap(pointsAwardedToday: number) {
  return pointsAwardedToday >= PET_COMMENT_DAILY_CAP;
}
