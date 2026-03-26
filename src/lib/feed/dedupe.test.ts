import { describe, expect, it } from "vitest";
import { buildDedupeKey, dedupeFeedKey } from "./dedupe";

describe("buildDedupeKey", () => {
  it("builds a stable key from source slug and canonical url", () => {
    expect(buildDedupeKey(" FDA ", " HTTPS://EXAMPLE.COM/FDA ")).toBe(
      "fda::https://example.com/fda",
    );
  });

  it("matches the alias helper", () => {
    expect(dedupeFeedKey("ema", "https://example.com/ema")).toBe(
      buildDedupeKey("ema", "https://example.com/ema"),
    );
  });
});
