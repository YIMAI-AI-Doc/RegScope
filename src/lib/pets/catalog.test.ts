import { describe, expect, it } from "vitest";
import { getSpeciesForTier, petSpecies, petTiers } from "./catalog";

describe("pet catalog", () => {
  it("defines 5 tiers and 25 species", () => {
    expect(petTiers).toHaveLength(5);
    expect(petSpecies).toHaveLength(25);
  });

  it("gives each tier 5 species", () => {
    for (const tier of petTiers) {
      expect(getSpeciesForTier(tier.slug)).toHaveLength(5);
    }
  });
});
