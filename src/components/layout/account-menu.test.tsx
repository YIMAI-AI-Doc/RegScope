import "@testing-library/jest-dom/vitest";
import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

import { AccountMenu } from "./account-menu";

describe("AccountMenu", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("keeps the hover panel open for 300ms after mouse leave", () => {
    const { container } = render(
      <AccountMenu
        viewer={{
          isAuthenticated: true,
          name: "demo",
          email: "demo@regscope.local",
          role: "USER",
        }}
        stats={{
          followCount: 4,
          answerCount: 3,
          discussionCount: 5,
        }}
        petSummary={{
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
        }}
      />,
    );

    const wrapper = container.querySelector(".account-menu");
    expect(wrapper).not.toBeNull();

    fireEvent.mouseEnter(wrapper!);
    expect(screen.getByRole("menu", { name: "账户面板" })).toBeInTheDocument();
    expect(screen.getByText("我的神兽")).toBeInTheDocument();
    expect(screen.getByText("当前积分 4 / 15")).toBeInTheDocument();

    fireEvent.mouseLeave(wrapper!);
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(screen.getByRole("menu", { name: "账户面板" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByRole("menu", { name: "账户面板" })).not.toBeInTheDocument();
  });
});
