import type { ContentType, FeedFormat, Source } from "@prisma/client";
import { createSlug } from "@/lib/feed/parser";
import { normalizeFeedItems, type NormalizedFeedItem } from "@/lib/feed/normalize";
import { buildDedupeKey } from "@/lib/feed/dedupe";
import { parseFeed, type FeedAdapterPayload, type FeedSourceConfig } from "@/lib/feed/parser";
import { upsertContentItem, type ContentUpsertInput, type PrismaLike } from "./upsert-content";

export type IngestSource = Pick<
  Source,
  "id" | "slug" | "name" | "feedUrl" | "feedFormat" | "countryId" | "isOfficial"
>;

export type SourceIngestReport = {
  sourceSlug: string;
  sourceId: string;
  fetchedItems: number;
  insertedItems: number;
  skippedItems: number;
  errors: string[];
};

type Fetcher = typeof fetch;

export async function runSingleFeed(
  source: IngestSource,
  client: PrismaLike,
  fetcher: Fetcher = fetch,
): Promise<SourceIngestReport> {
  const report: SourceIngestReport = {
    sourceSlug: source.slug,
    sourceId: source.id,
    fetchedItems: 0,
    insertedItems: 0,
    skippedItems: 0,
    errors: [],
  };

  if (!source.feedUrl) {
    report.errors.push("Source has no feedUrl");
    return report;
  }

  try {
    const payload = await fetchFeedPayload(source.feedUrl, fetcher);
    const parsed = await parseFeed(feedSourceConfig(source), payload);
    const normalized = normalizeFeedItems(parsed);
    const seen = new Set<string>();

    for (const item of normalized) {
      report.fetchedItems += 1;

      if (!item.canonicalUrl) {
        report.skippedItems += 1;
        continue;
      }

      const dedupeKey = buildDedupeKey(source.slug, item.canonicalUrl);
      if (seen.has(dedupeKey)) {
        report.skippedItems += 1;
        continue;
      }
      seen.add(dedupeKey);

      const upsertInput = buildContentUpsertInput(source, item);
      await upsertContentItem(upsertInput, client);
      report.insertedItems += 1;
    }
  } catch (error) {
    report.errors.push(error instanceof Error ? error.message : "Unknown ingestion error");
  }

  return report;
}

function feedSourceConfig(source: IngestSource): FeedSourceConfig {
  return {
    slug: source.slug,
    feedUrl: source.feedUrl,
    feedFormat: source.feedFormat as FeedFormat | null | undefined,
    name: source.name,
  };
}

async function fetchFeedPayload(feedUrl: string, fetcher: Fetcher): Promise<FeedAdapterPayload> {
  const response = await fetcher(feedUrl, {
    headers: {
      Accept: "application/rss+xml, application/atom+xml, application/json, text/xml, */*",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

function buildContentUpsertInput(source: IngestSource, item: NormalizedFeedItem): ContentUpsertInput {
  return {
    slug: item.slug || createSlug(item.title, item.canonicalUrl),
    title: item.title,
    summary: item.summary,
    body: null,
    canonicalUrl: item.canonicalUrl,
    contentType: inferContentType(source, item),
    publishedAt: item.publishedAt,
    sourceId: source.id,
    countryId: source.countryId,
    primaryTopicId: null,
  };
}

function inferContentType(source: IngestSource, item: NormalizedFeedItem): ContentType {
  const text = `${item.title} ${item.summary}`.toLowerCase();

  if (text.includes("alert") || text.includes("warning") || text.includes("警报")) {
    return "ALERT";
  }

  if (text.includes("guidance") || text.includes("指南") || text.includes("draft")) {
    return "GUIDANCE";
  }

  if (source.isOfficial) {
    return "POLICY";
  }

  return "NEWS";
}
