import type { ParsedFeedItem } from "./parser";
import { normalizeWhitespace } from "./parser";

export type NormalizedFeedItem = ParsedFeedItem;

export function normalizeFeedItem(item: ParsedFeedItem): NormalizedFeedItem {
  return {
    ...item,
    title: normalizeWhitespace(item.title),
    summary: normalizeWhitespace(item.summary),
    canonicalUrl: normalizeWhitespace(item.canonicalUrl),
    slug: item.slug,
  };
}

export function normalizeFeedItems(items: ParsedFeedItem[]): NormalizedFeedItem[] {
  return items.map(normalizeFeedItem);
}
