import "@testing-library/jest-dom/vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MyPetCard } from "./my-pet-card";

describe("MyPetCard", () => {
  it("renders current tier, species, and 3-star progress", () => {
    render(
      <MyPetCard
        pet={{
          tierSlug: "MENGLING",
          tierName: "萌灵",
          tierFlavor: "灵动治愈，开始展现互动感与灵气。",
          speciesSlug: "samoyed",
          speciesName: "萨摩耶",
          speciesTitle: "微笑云犬",
          family: "canine",
          motionPreset: "wag",
          visualStyle: "雪白蓬松，笑脸明显，云团般尾巴。",
          traitKeywords: ["微笑", "雪白", "蓬松"],
          colors: { body: "#f5f8fc", accent: "#7aa5d8", aura: "#eef7ff" },
          growthStageConfig: {
            BABY: { scale: 0.82, ornamentLevel: 1, aura: "none" },
            GROWING: { scale: 0.94, ornamentLevel: 2, aura: "soft" },
            MATURE: { scale: 1.06, ornamentLevel: 3, aura: "radiant" },
          },
          currentPoints: 9,
          totalRequiredPoints: 15,
          stage: "GROWING",
          starFill: [1, 0.8, 0],
          nextTierName: "珍宠",
          pointsRemaining: 6,
          isMaxTier: false,
        }}
      />,
    );

    expect(screen.getByText("我的神兽")).toBeInTheDocument();
    expect(screen.getByText("神兽图鉴与互动 >")).toBeInTheDocument();
    expect(screen.getByText("萌灵阶")).toBeInTheDocument();
    expect(screen.getByText("萨摩耶")).toBeInTheDocument();
    expect(screen.getByText("当前积分 9 / 15")).toBeInTheDocument();
    expect(screen.queryByText("微笑云犬")).not.toBeInTheDocument();
    expect(screen.queryByText("雪白蓬松，笑脸明显，云团般尾巴。")).not.toBeInTheDocument();
    expect(screen.queryByText("微笑")).not.toBeInTheDocument();
  });
});
