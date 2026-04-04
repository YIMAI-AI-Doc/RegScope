import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

vi.mock("@/lib/pets/queries", () => ({
  getCurrentUserPetCardData: vi.fn(),
}));

import { getServerSession } from "next-auth";
import { getCurrentUserPetCardData } from "@/lib/pets/queries";
import { GET } from "./route";

const mockedGetServerSession = vi.mocked(getServerSession);
const mockedGetCurrentUserPetCardData = vi.mocked(getCurrentUserPetCardData);

afterEach(() => {
  vi.clearAllMocks();
});

describe("current pet route", () => {
  it("rejects anonymous users", async () => {
    mockedGetServerSession.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
  });

  it("returns the current pet card data for an authenticated user", async () => {
    mockedGetServerSession.mockResolvedValue({
      user: { id: "user-1" },
    } as never);
    mockedGetCurrentUserPetCardData.mockResolvedValue({
      tierSlug: "FANZAI",
      tierName: "凡崽",
      tierFlavor: "凡间萌崽，亲近、圆润、新手友好。",
      speciesSlug: "garden-cat",
      speciesName: "中华田园猫",
      speciesTitle: "本土守护喵",
      family: "feline",
      motionPreset: "pounce",
      visualStyle: "圆脸奶猫，暖色毛流和大眼睛。",
      traitKeywords: ["奶猫", "圆脸"],
      colors: { body: "#f0b778", accent: "#9f5324", aura: "#f6e4cc" },
      growthStageConfig: {
        BABY: { scale: 0.82, ornamentLevel: 1, aura: "none" },
        GROWING: { scale: 0.94, ornamentLevel: 2, aura: "soft" },
        MATURE: { scale: 1.06, ornamentLevel: 3, aura: "radiant" },
      },
      currentPoints: 4,
      totalRequiredPoints: 15,
      stage: "BABY",
      starFill: [0.8, 0, 0],
      nextTierName: "萌灵",
      pointsRemaining: 11,
      isMaxTier: false,
    });

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.speciesName).toBe("中华田园猫");
    expect(mockedGetCurrentUserPetCardData).toHaveBeenCalledWith("user-1");
  });
});
