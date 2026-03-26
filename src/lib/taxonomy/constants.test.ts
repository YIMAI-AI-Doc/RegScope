import { describe, expect, it } from "vitest";
import { topLevelTopics } from "./constants";

describe("topLevelTopics", () => {
  it("defines the approved 8 top-level topics", () => {
    expect(topLevelTopics).toHaveLength(8);
  });
});
