import "@testing-library/jest-dom/vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/components/profile/profile-avatar-card", () => ({
  ProfileAvatarCard: ({ name }: { name: string }) => <div>头像卡片:{name}</div>,
}));

vi.mock("@/lib/pets/queries", () => ({
  getCurrentUserPetCardData: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    follow: { count: vi.fn() },
    answer: { count: vi.fn() },
    discussion: { count: vi.fn() },
    user: { findUnique: vi.fn() },
    contentFavorite: { findMany: vi.fn() },
    discussionFavorite: { findMany: vi.fn() },
  },
}));

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUserPetCardData } from "@/lib/pets/queries";
import MePage from "./page";

const mockedGetServerSession = vi.mocked(getServerSession);
const mockedRedirect = vi.mocked(redirect);
const mockedPrisma = vi.mocked(prisma, { deep: true });
const mockedGetCurrentUserPetCardData = vi.mocked(getCurrentUserPetCardData);
const redirectSignal = new Error("NEXT_REDIRECT");

beforeEach(() => {
  vi.clearAllMocks();
  mockedRedirect.mockImplementation(() => {
    throw redirectSignal;
  });
});

describe("MePage", () => {
  it("redirects anonymous users to sign in", async () => {
    mockedGetServerSession.mockResolvedValue(null as never);

    await expect(MePage()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockedRedirect).toHaveBeenCalledWith("/api/auth/signin");
  });

  it("renders the current pet card for a logged-in user", async () => {
    mockedGetServerSession.mockResolvedValue({
      user: { id: "user-1", name: "Demo User", email: "demo@regscope.local" },
    } as never);
    mockedPrisma.user.findUnique.mockResolvedValue({
      avatarUrl: null,
      name: "Demo User",
      email: "demo@regscope.local",
    } as never);
    mockedPrisma.follow.count.mockResolvedValue(4 as never);
    mockedPrisma.answer.count.mockResolvedValue(3 as never);
    mockedPrisma.discussion.count.mockResolvedValue(2 as never);
    mockedPrisma.contentFavorite.findMany.mockResolvedValue([] as never);
    mockedPrisma.discussionFavorite.findMany.mockResolvedValue([] as never);
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

    render(await MePage());

    expect(screen.getByText("我的神兽")).toBeInTheDocument();
    expect(screen.getByText("神兽图鉴与互动 >")).toBeInTheDocument();
    expect(screen.getByText("中华田园猫")).toBeInTheDocument();
    expect(screen.queryByText("本土守护喵")).not.toBeInTheDocument();
  });
});
