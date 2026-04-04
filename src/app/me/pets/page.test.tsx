import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/pets/queries", () => ({
  getPetDexPageData: vi.fn(),
}));

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getPetDexPageData } from "@/lib/pets/queries";
import MyPetsPage from "./page";

const mockedGetServerSession = vi.mocked(getServerSession);
const mockedRedirect = vi.mocked(redirect);
const mockedGetPetDexPageData = vi.mocked(getPetDexPageData);
const redirectSignal = new Error("NEXT_REDIRECT");

beforeEach(() => {
  vi.clearAllMocks();
  mockedRedirect.mockImplementation(() => {
    throw redirectSignal;
  });
});

describe("MyPetsPage", () => {
  it("redirects anonymous users to sign in", async () => {
    mockedGetServerSession.mockResolvedValue(null as never);

    await expect(MyPetsPage()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockedRedirect).toHaveBeenCalledWith("/api/auth/signin");
  });

  it("renders the pet dex page for a logged-in user", async () => {
    mockedGetServerSession.mockResolvedValue({
      user: { id: "user-1" },
    } as never);
    mockedGetPetDexPageData.mockResolvedValue({
      currentPet: {
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
      },
      tiers: [
        {
          slug: "FANZAI",
          name: "凡崽",
          flavor: "凡间萌崽，亲近、圆润、新手友好。",
          unlocked: true,
          current: true,
          species: [
            {
              slug: "garden-cat",
              name: "中华田园猫",
              title: "本土守护喵",
              unlocked: true,
              isCurrent: true,
              colors: { body: "#f0b778", accent: "#9f5324", aura: "#f6e4cc" },
              visualStyle: "圆脸奶猫，暖色毛流和大眼睛。",
            },
          ],
        },
      ],
    });

    render(await MyPetsPage());

    expect(screen.getByText("神兽图鉴与互动")).toBeInTheDocument();
    expect(screen.getByText("当前神兽")).toBeInTheDocument();
    expect(screen.getByText("升级规则")).toBeInTheDocument();
    expect(screen.getAllByText("中华田园猫")).toHaveLength(2);
  });
});
