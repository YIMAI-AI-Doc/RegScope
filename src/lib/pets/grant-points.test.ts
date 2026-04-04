import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type State = {
  profile: {
    id: string;
    userId: string;
    currentTierId: string;
    currentSpeciesId: string;
    currentPoints: number;
    currentStage: "BABY" | "GROWING" | "MATURE";
    totalPointsEarned: number;
    lastUpgradeAt: Date | null;
  } | null;
  events: Array<{
    userId: string;
    eventType: string;
    sourceId: string | null;
    sourceType: string | null;
    points: number;
    createdAt: Date;
  }>;
};

const tiers = {
  FANZAI: { id: "tier-fanzai", slug: "FANZAI", name: "凡崽", sortOrder: 1 },
  MENGLING: { id: "tier-mengling", slug: "MENGLING", name: "萌灵", sortOrder: 2 },
  SHENSHOU: { id: "tier-shenshou", slug: "SHENSHOU", name: "神兽", sortOrder: 5 },
} as const;

const species = {
  fanzai: { id: "species-fanzai", slug: "garden-cat", name: "中华田园猫", tierId: tiers.FANZAI.id },
  mengling: { id: "species-mengling", slug: "samoyed", name: "萨摩耶", tierId: tiers.MENGLING.id },
} as const;

let state: State;

function withRelations(profile: NonNullable<State["profile"]>) {
  const tier =
    profile.currentTierId === tiers.FANZAI.id
      ? tiers.FANZAI
      : profile.currentTierId === tiers.MENGLING.id
      ? tiers.MENGLING
      : tiers.SHENSHOU;
  const currentSpecies = profile.currentSpeciesId === species.fanzai.id ? species.fanzai : species.mengling;

  return {
    ...profile,
    currentTier: tier,
    currentSpecies,
  };
}

vi.mock("@/lib/db", () => ({
  prisma: {
    userPetProfile: {
      findUnique: vi.fn(async ({ where }: { where: { userId: string } }) =>
        state.profile && state.profile.userId === where.userId ? withRelations(state.profile) : null,
      ),
      create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
        state.profile = {
          id: "profile-1",
          userId: data.userId as string,
          currentTierId: data.currentTierId as string,
          currentSpeciesId: data.currentSpeciesId as string,
          currentPoints: data.currentPoints as number,
          currentStage: data.currentStage as "BABY" | "GROWING" | "MATURE",
          totalPointsEarned: data.totalPointsEarned as number,
          lastUpgradeAt: null,
        };
        return withRelations(state.profile);
      }),
      update: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
        if (!state.profile) {
          throw new Error("profile missing");
        }

        state.profile = {
          ...state.profile,
          currentTierId: (data.currentTierId as string | undefined) ?? state.profile.currentTierId,
          currentSpeciesId: (data.currentSpeciesId as string | undefined) ?? state.profile.currentSpeciesId,
          currentPoints: (data.currentPoints as number | undefined) ?? state.profile.currentPoints,
          currentStage: (data.currentStage as "BABY" | "GROWING" | "MATURE" | undefined) ?? state.profile.currentStage,
          totalPointsEarned:
            typeof data.totalPointsEarned === "object" && data.totalPointsEarned && "increment" in (data.totalPointsEarned as Record<string, unknown>)
              ? state.profile.totalPointsEarned + Number((data.totalPointsEarned as { increment: number }).increment)
              : state.profile.totalPointsEarned,
          lastUpgradeAt: (data.lastUpgradeAt as Date | null | undefined) ?? state.profile.lastUpgradeAt,
        };

        return withRelations(state.profile);
      }),
    },
    petTier: {
      findUnique: vi.fn(async ({ where }: { where: { slug: string } }) => {
        if (where.slug === "FANZAI") {
          return { ...tiers.FANZAI, species: [species.fanzai] };
        }
        if (where.slug === "MENGLING") {
          return { ...tiers.MENGLING, species: [species.mengling] };
        }
        return null;
      }),
    },
    userPetEvent: {
      findFirst: vi.fn(async ({ where }: { where: { userId: string; eventType: string; sourceId: string | null; sourceType: string | null } }) =>
        state.events.find(
          (item) =>
            item.userId === where.userId &&
            item.eventType === where.eventType &&
            item.sourceId === where.sourceId &&
            item.sourceType === where.sourceType,
        ) ?? null,
      ),
      findMany: vi.fn(async ({ where }: { where: { userId: string; eventType: string } }) =>
        state.events.filter((item) => item.userId === where.userId && item.eventType === where.eventType),
      ),
      create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
        state.events.push({
          userId: data.userId as string,
          eventType: data.eventType as string,
          sourceId: (data.sourceId as string | null | undefined) ?? null,
          sourceType: (data.sourceType as string | null | undefined) ?? null,
          points: data.points as number,
          createdAt: new Date(),
        });
        return { id: `event-${state.events.length}` };
      }),
    },
    $transaction: vi.fn(async (callback: (tx: unknown) => Promise<unknown>) =>
      callback((await import("@/lib/db")).prisma),
    ),
  },
}));

import { ensureUserPetProfile, grantPetPoints } from "./grant-points";

describe("grantPetPoints", () => {
  beforeEach(() => {
    state = {
      profile: null,
      events: [],
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("bootstraps a new user into 凡崽 with a random species", async () => {
    const profile = await ensureUserPetProfile("user-1", () => 0);

    expect(profile.currentTier.slug).toBe("FANZAI");
    expect(profile.currentSpecies.slug).toBe("garden-cat");
    expect(profile.currentPoints).toBe(0);
    expect(profile.currentStage).toBe("BABY");
  });

  it("upgrades to the next tier after reaching 15 points", async () => {
    state.profile = {
      id: "profile-1",
      userId: "user-1",
      currentTierId: tiers.FANZAI.id,
      currentSpeciesId: species.fanzai.id,
      currentPoints: 13,
      currentStage: "MATURE",
      totalPointsEarned: 13,
      lastUpgradeAt: null,
    };

    const result = await grantPetPoints({
      userId: "user-1",
      eventType: "DISCUSSION_POST",
      sourceId: "discussion-1",
      sourceType: "DISCUSSION",
      randomFn: () => 0,
    });

    expect(result.didUpgrade).toBe(true);
    expect(result.profile.currentTier.slug).toBe("MENGLING");
    expect(result.profile.currentSpecies.slug).toBe("samoyed");
    expect(result.profile.currentPoints).toBe(0);
    expect(result.profile.currentStage).toBe("BABY");
  });
});
