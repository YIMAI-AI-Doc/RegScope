import { describe, expect, it, vi } from "vitest";
import { upsertContentItem } from "./upsert-content";

describe("upsertContentItem", () => {
  it("upserts by canonicalUrl and writes the normalized payload", async () => {
    const upsert = vi.fn().mockResolvedValue({ id: "content-1" });
    const client = { contentItem: { upsert } };

    const result = await upsertContentItem(
      {
        slug: "fda-ai-guidance-demo",
        title: " FDA guidance update ",
        summary: " summary text ",
        body: null,
        canonicalUrl: " https://example.com/articles/1 ",
        contentType: "GUIDANCE",
        publishedAt: new Date("2026-03-26T00:00:00.000Z"),
        sourceId: "source-1",
        countryId: "country-1",
        primaryTopicId: null,
      },
      client,
    );

    expect(result).toEqual({ id: "content-1" });
    expect(upsert).toHaveBeenCalledWith({
      where: { canonicalUrl: "https://example.com/articles/1" },
      update: {
        slug: "fda-ai-guidance-demo",
        title: " FDA guidance update ",
        summary: " summary text ",
        body: null,
        contentType: "GUIDANCE",
        publishedAt: new Date("2026-03-26T00:00:00.000Z"),
        sourceId: "source-1",
        countryId: "country-1",
        primaryTopicId: null,
      },
      create: {
        slug: "fda-ai-guidance-demo",
        title: " FDA guidance update ",
        summary: " summary text ",
        body: null,
        canonicalUrl: "https://example.com/articles/1",
        contentType: "GUIDANCE",
        publishedAt: new Date("2026-03-26T00:00:00.000Z"),
        sourceId: "source-1",
        countryId: "country-1",
        primaryTopicId: null,
      },
    });
  });
});
