import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseFeed, resolveFeedFormat } from "./parser";
import { parseAtomFeed } from "./adapters/atom";
import { parseJsonFeed } from "./adapters/json";
import { parseRssFeed } from "./adapters/rss";

vi.mock("./adapters/rss", () => ({
  parseRssFeed: vi.fn(),
}));

vi.mock("./adapters/atom", () => ({
  parseAtomFeed: vi.fn(),
}));

vi.mock("./adapters/json", () => ({
  parseJsonFeed: vi.fn(),
}));

describe("resolveFeedFormat", () => {
  it("prefers source config over payload heuristics", () => {
    expect(
      resolveFeedFormat(
        { slug: "fda", feedFormat: "ATOM" },
        "{\"items\":[{\"title\":\"x\"}]}",
      ),
    ).toBe("ATOM");
  });

  it("falls back to heuristics when feedFormat is AUTO", () => {
    expect(
      resolveFeedFormat(
        { slug: "fda", feedFormat: "AUTO" },
        "{\"items\":[{\"title\":\"x\"}]}",
      ),
    ).toBe("JSON");
  });
});

describe("parseFeed", () => {
  beforeEach(() => {
    vi.mocked(parseRssFeed).mockReset();
    vi.mocked(parseAtomFeed).mockReset();
    vi.mocked(parseJsonFeed).mockReset();
  });

  it("routes RSS payloads to the RSS adapter", async () => {
    vi.mocked(parseRssFeed).mockResolvedValue([
      {
        title: "FDA update",
        summary: "summary",
        canonicalUrl: "https://example.com/fda",
        publishedAt: new Date("2026-03-26T00:00:00Z"),
        slug: "fda-update",
        sourceSlug: "fda",
        feedFormat: "RSS",
      },
    ]);

    await parseFeed({ slug: "fda" }, "<rss><channel><item /></channel></rss>");

    expect(parseRssFeed).toHaveBeenCalledTimes(1);
    expect(parseAtomFeed).not.toHaveBeenCalled();
    expect(parseJsonFeed).not.toHaveBeenCalled();
  });

  it("routes Atom payloads to the Atom adapter", async () => {
    vi.mocked(parseAtomFeed).mockResolvedValue([
      {
        title: "EMA update",
        summary: "summary",
        canonicalUrl: "https://example.com/ema",
        publishedAt: new Date("2026-03-26T00:00:00Z"),
        slug: "ema-update",
        sourceSlug: "ema",
        feedFormat: "ATOM",
      },
    ]);

    await parseFeed({ slug: "ema", feedFormat: "ATOM" }, "<feed><entry /></feed>");

    expect(parseAtomFeed).toHaveBeenCalledTimes(1);
    expect(parseRssFeed).not.toHaveBeenCalled();
    expect(parseJsonFeed).not.toHaveBeenCalled();
  });

  it("routes JSON payloads to the JSON adapter", async () => {
    vi.mocked(parseJsonFeed).mockResolvedValue([
      {
        title: "JSON item",
        summary: "summary",
        canonicalUrl: "https://example.com/json",
        publishedAt: new Date("2026-03-26T00:00:00Z"),
        slug: "json-item",
        sourceSlug: "json",
        feedFormat: "JSON",
      },
    ]);

    await parseFeed(
      { slug: "json-source" },
      JSON.stringify({ items: [{ title: "JSON item" }] }),
    );

    expect(parseJsonFeed).toHaveBeenCalledTimes(1);
    expect(parseRssFeed).not.toHaveBeenCalled();
    expect(parseAtomFeed).not.toHaveBeenCalled();
  });
});
