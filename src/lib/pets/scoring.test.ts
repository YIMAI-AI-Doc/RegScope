import { describe, expect, it } from "vitest";
import {
  getNextTierSlug,
  getPointsForEvent,
  getStageForPoints,
  getStarFill,
  hasReachedCommentDailyCap,
} from "./scoring";

describe("pet scoring", () => {
  it("maps current points to the correct stage", () => {
    expect(getStageForPoints(0)).toBe("BABY");
    expect(getStageForPoints(5)).toBe("GROWING");
    expect(getStageForPoints(10)).toBe("MATURE");
  });

  it("uses the approved event points", () => {
    expect(getPointsForEvent("DAILY_QUESTION")).toBe(1);
    expect(getPointsForEvent("COMMENT")).toBe(1);
    expect(getPointsForEvent("DISCUSSION_POST")).toBe(2);
    expect(getPointsForEvent("ARTICLE")).toBe(3);
  });

  it("fills the three stars in 5-point buckets", () => {
    expect(getStarFill(4)).toEqual([0.8, 0, 0]);
    expect(getStarFill(9)).toEqual([1, 0.8, 0]);
    expect(getStarFill(14)).toEqual([1, 1, 0.8]);
  });

  it("finds the next tier and stops at max tier", () => {
    expect(getNextTierSlug("FANZAI")).toBe("MENGLING");
    expect(getNextTierSlug("SHENSHOU")).toBeNull();
  });

  it("enforces the daily comment cap", () => {
    expect(hasReachedCommentDailyCap(2)).toBe(false);
    expect(hasReachedCommentDailyCap(3)).toBe(true);
  });
});
