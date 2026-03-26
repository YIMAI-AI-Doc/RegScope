import type { FeedAdapterPayload, FeedSourceConfig, ParsedFeedItem } from "../parser";
import { createSlug, normalizeWhitespace, parseWithRssParser } from "../parser";

type AtomParserItem = {
  title?: string | null;
  link?: string | { href?: string | null } | null;
  isoDate?: string | null;
  pubDate?: string | null;
  content?: string | null;
  contentSnippet?: string | null;
  summary?: string | null;
};

export async function parseAtomFeed(
  source: FeedSourceConfig,
  payload: FeedAdapterPayload,
): Promise<ParsedFeedItem[]> {
  const feed = (await parseWithRssParser(payload)) as {
    items?: AtomParserItem[];
  };

  return (feed.items ?? []).map((item) => {
    const link = typeof item.link === "string" ? item.link : item.link?.href ?? "";
    const title = normalizeWhitespace(item.title ?? "未命名条目");
    const canonicalUrl = normalizeWhitespace(link || source.feedUrl || "");
    const summary = normalizeWhitespace(
      item.contentSnippet ?? item.summary ?? item.content ?? "",
    );
    const publishedAt = new Date(item.isoDate ?? item.pubDate ?? Date.now());

    return {
      title,
      summary,
      canonicalUrl,
      publishedAt,
      slug: createSlug(title, canonicalUrl),
      sourceSlug: source.slug,
      feedFormat: "ATOM",
    };
  });
}
