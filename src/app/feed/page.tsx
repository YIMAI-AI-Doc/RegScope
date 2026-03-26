import React from "react";
import type { Metadata } from "next";
import { IntelligenceCard } from "@/components/cards/intelligence-card";
import { FeedFilters } from "@/components/filters/feed-filters";
import { getFeedPageData, type FeedFilters as FeedFiltersInput } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "情报快讯 | RegScope",
  description: "按国家、机构、领域和时间筛选全球医药监管更新。",
};

type FeedPageProps = {
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
};

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const filters = normalizeSearchParams(resolvedSearchParams);
  const data = await getFeedPageData(filters);

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <section style={{ display: "grid", gap: "10px" }}>
        <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}>
          情报快讯
        </p>
        <h1 style={{ margin: 0, fontSize: "clamp(1.9rem, 4vw, 3rem)", lineHeight: 1.1 }}>
          快速筛选全球医药监管更新
        </h1>
        <p style={{ margin: 0, maxWidth: "62ch", color: "var(--muted)", lineHeight: 1.8 }}>
          按国家、来源、领域、内容类型和时间范围过滤内容，先看最新，再看最相关。
        </p>
      </section>

      <FeedFilters
        current={filters}
        groups={[
          { label: "国家 / 地区", key: "country", items: data.filters.countries },
          { label: "官方来源", key: "source", items: data.filters.sources },
          { label: "领域", key: "topic", items: data.filters.topics },
          { label: "内容类型", key: "contentType", items: data.filters.contentTypes },
          { label: "时间范围", key: "timeRange", items: data.filters.timeRanges },
        ]}
      />

      <section style={{ display: "grid", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <p style={{ margin: 0, fontWeight: 700 }}>结果</p>
          <span style={{ color: "var(--muted)" }}>{data.total} 条内容</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px",
          }}
        >
          {data.items.map((item) => (
            <IntelligenceCard key={item.slug} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}

function normalizeSearchParams(
  searchParams: Record<string, string | string[] | undefined> = {},
): FeedFiltersInput {
  return {
    country: first(searchParams.country),
    source: first(searchParams.source),
    topic: first(searchParams.topic),
    contentType: first(searchParams.contentType),
    timeRange: first(searchParams.timeRange),
    query: first(searchParams.query),
  };
}

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}
