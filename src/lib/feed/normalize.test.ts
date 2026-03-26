import { describe, expect, it } from "vitest";
import { normalizeFeedItem, normalizeFeedItems } from "./normalize";

describe("normalizeFeedItem", () => {
  it("collapses duplicate whitespace in title summary and canonical url", () => {
    const normalized = normalizeFeedItem({
      title: "  FDA   issues   guidance  ",
      summary: "Line 1\n\nLine 2\t\tLine 3",
      canonicalUrl: " https://example.com/fda/guidance ",
      publishedAt: new Date("2026-03-26T00:00:00Z"),
      slug: "fda-guidance-1234",
      sourceSlug: "fda",
      feedFormat: "RSS",
    });

    expect(normalized.title).toBe("FDA issues guidance");
    expect(normalized.summary).toBe("Line 1 Line 2 Line 3");
    expect(normalized.canonicalUrl).toBe("https://example.com/fda/guidance");
  });
});

describe("normalizeFeedItems", () => {
  it("preserves order while normalizing each item", () => {
    const items = normalizeFeedItems([
      {
        title: " First ",
        summary: " one ",
        canonicalUrl: " https://example.com/one ",
        publishedAt: new Date("2026-03-26T00:00:00Z"),
        slug: "first-a",
        sourceSlug: "fda",
        feedFormat: "RSS",
      },
      {
        title: " Second ",
        summary: " two ",
        canonicalUrl: " https://example.com/two ",
        publishedAt: new Date("2026-03-26T00:00:00Z"),
        slug: "second-b",
        sourceSlug: "ema",
        feedFormat: "ATOM",
      },
    ]);

    expect(items[0].title).toBe("First");
    expect(items[1].title).toBe("Second");
  });
});
