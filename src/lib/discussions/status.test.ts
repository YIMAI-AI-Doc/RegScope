import { describe, expect, it } from "vitest";
import {
  canEditCanonicalConclusion,
  getDiscussionStatusMeta,
  getEvidenceLabelMeta,
  normalizeDiscussionStatus,
} from "./status";

describe("discussion status helpers", () => {
  it("normalizes unknown discussion statuses to OPEN", () => {
    expect(normalizeDiscussionStatus("something-else")).toBe("OPEN");
    expect(normalizeDiscussionStatus(undefined)).toBe("OPEN");
  });

  it("maps discussion status metadata to Chinese labels", () => {
    const meta = getDiscussionStatusMeta("PROVISIONAL_CONCLUSION");

    expect(meta.value).toBe("PROVISIONAL_CONCLUSION");
    expect(meta.label).toBe("阶段性结论");
    expect(meta.description).toContain("当前判断");
  });

  it("maps evidence label metadata to Chinese labels", () => {
    const meta = getEvidenceLabelMeta("OFFICIAL");

    expect(meta.value).toBe("OFFICIAL");
    expect(meta.label).toBe("官方原文");
  });

  it("allows canonical conclusion editing for admin-like roles only", () => {
    expect(canEditCanonicalConclusion("ADMIN")).toBe(true);
    expect(canEditCanonicalConclusion("MODERATOR")).toBe(true);
    expect(canEditCanonicalConclusion("USER")).toBe(false);
  });
});
