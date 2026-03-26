import { createHash } from "node:crypto";
import Parser from "rss-parser";
import { parseAtomFeed } from "./adapters/atom";
import { parseJsonFeed } from "./adapters/json";
import { parseRssFeed } from "./adapters/rss";

export type FeedFormat = "AUTO" | "RSS" | "ATOM" | "JSON";

export type FeedSourceConfig = {
  slug: string;
  feedUrl?: string | null;
  feedFormat?: FeedFormat | null;
  name?: string | null;
};

export type ParsedFeedItem = {
  title: string;
  summary: string;
  canonicalUrl: string;
  publishedAt: Date;
  slug: string;
  sourceSlug: string;
  feedFormat: Exclude<FeedFormat, "AUTO">;
};

export type FeedAdapterPayload = string | Record<string, unknown>;

const rssParser = new Parser({
  customFields: {
    item: ["content:encoded", "summary"],
  },
});

export function parseFeed(
  source: FeedSourceConfig,
  payload: FeedAdapterPayload,
): Promise<ParsedFeedItem[]> {
  const format = resolveFeedFormat(source, payload);

  if (format === "JSON") {
    return parseJsonFeed(source, payload);
  }

  if (format === "ATOM") {
    return parseAtomFeed(source, payload);
  }

  return parseRssFeed(source, payload);
}

export function resolveFeedFormat(
  source: FeedSourceConfig,
  payload: FeedAdapterPayload,
): Exclude<FeedFormat, "AUTO"> {
  if (source.feedFormat && source.feedFormat !== "AUTO") {
    return source.feedFormat;
  }

  if (typeof payload === "string") {
    const trimmed = payload.trimStart();

    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      return "JSON";
    }

    if (/<feed[\s>]/i.test(trimmed)) {
      return "ATOM";
    }

    if (/<rss[\s>]/i.test(trimmed) || /<channel[\s>]/i.test(trimmed)) {
      return "RSS";
    }
  }

  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    if ("items" in payload) {
      return "JSON";
    }
  }

  return "RSS";
}

export async function parseWithRssParser(payload: FeedAdapterPayload) {
  const input = typeof payload === "string" ? payload : JSON.stringify(payload);
  return rssParser.parseString(input);
}

export function createSlug(title: string, canonicalUrl: string) {
  const base = slugify(title) || slugify(canonicalUrl) || "item";
  const hash = createHash("sha1").update(canonicalUrl).digest("hex").slice(0, 8);
  return `${base}-${hash}`;
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}
