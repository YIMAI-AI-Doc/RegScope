import type { FeedAdapterPayload, FeedSourceConfig, ParsedFeedItem } from "../parser";
import { createSlug, normalizeWhitespace, parseWithRssParser } from "../parser";

type RssParserItem = {
  title?: string | null;
  link?: string | null;
  isoDate?: string | null;
  pubDate?: string | null;
  content?: string | null;
  contentSnippet?: string | null;
  summary?: string | null;
};

export async function parseRssFeed(
  source: FeedSourceConfig,
  payload: FeedAdapterPayload,
): Promise<ParsedFeedItem[]> {
  const feed = (await parseWithRssParser(payload)) as {
    items?: RssParserItem[];
  };

  return (feed.items ?? []).map((item) => {
    const title = normalizeWhitespace(item.title ?? "未命名条目");
    const canonicalUrl = normalizeWhitespace(item.link ?? source.feedUrl ?? "");
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
      feedFormat: "RSS",
    };
  });
}
