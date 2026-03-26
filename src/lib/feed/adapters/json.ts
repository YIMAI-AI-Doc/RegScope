import type { FeedAdapterPayload, FeedSourceConfig, ParsedFeedItem } from "../parser";
import { createSlug, normalizeWhitespace } from "../parser";

type JsonFeedItem = {
  title?: string | null;
  url?: string | null;
  canonicalUrl?: string | null;
  summary?: string | null;
  content_text?: string | null;
  content_html?: string | null;
  date_published?: string | null;
  publishedAt?: string | null;
};

export async function parseJsonFeed(
  source: FeedSourceConfig,
  payload: FeedAdapterPayload,
): Promise<ParsedFeedItem[]> {
  const data = typeof payload === "string" ? JSON.parse(payload) : payload;
  const items = Array.isArray((data as { items?: JsonFeedItem[] }).items)
    ? ((data as { items: JsonFeedItem[] }).items ?? [])
    : [];

  return items.map((item) => {
    const title = normalizeWhitespace(item.title ?? "未命名条目");
    const canonicalUrl = normalizeWhitespace(item.canonicalUrl ?? item.url ?? source.feedUrl ?? "");
    const summary = normalizeWhitespace(
      item.summary ?? item.content_text ?? item.content_html ?? "",
    );
    const publishedAt = new Date(item.date_published ?? item.publishedAt ?? Date.now());

    return {
      title,
      summary,
      canonicalUrl,
      publishedAt,
      slug: createSlug(title, canonicalUrl),
      sourceSlug: source.slug,
      feedFormat: "JSON",
    };
  });
}
