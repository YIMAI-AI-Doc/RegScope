import "@testing-library/jest-dom/vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CurrentUserPetCardData } from "@/lib/pets/queries";
import { PetAvatarStage } from "./pet-avatar-stage";

const basePet: Pick<
  CurrentUserPetCardData,
  | "tierSlug"
  | "speciesSlug"
  | "speciesName"
  | "family"
  | "motionPreset"
  | "stage"
  | "colors"
  | "growthStageConfig"
  | "traitKeywords"
> = {
  tierSlug: "ZHENCHONG",
  speciesSlug: "baiji",
  speciesName: "白鱀豚",
  family: "aquatic",
  motionPreset: "swim",
  stage: "MATURE",
  colors: { body: "#dceaf6", accent: "#78a6cf", aura: "#dff4fb" },
  growthStageConfig: {
    BABY: { scale: 0.82, ornamentLevel: 1, aura: "none" },
    GROWING: { scale: 0.94, ornamentLevel: 2, aura: "soft" },
    MATURE: { scale: 1.06, ornamentLevel: 3, aura: "radiant" },
  },
  traitKeywords: ["灵动", "清澈", "温和"],
};

describe("PetAvatarStage", () => {
  it("exposes stage and motion metadata on the root node", () => {
    render(<PetAvatarStage pet={basePet} compact />);

    const root = screen.getByTestId("pet-stage-root");

    expect(root).toHaveAttribute("data-stage", "MATURE");
    expect(root).toHaveAttribute("data-motion", "swim");
    expect(root).toHaveClass("pet-stage", "motion-swim", "stage-mature", "is-compact");
  });

  it("renders ornaments from the growth stage and adds one more for shenshou tier", () => {
    const { container } = render(
      <PetAvatarStage
        pet={{
          ...basePet,
          tierSlug: "SHENSHOU",
          speciesSlug: "azure-dragon",
          speciesName: "青龙",
          family: "reptile",
          motionPreset: "orbit",
        }}
      />,
    );

    expect(container.querySelectorAll(".pet-ornament")).toHaveLength(4);
  });
});
