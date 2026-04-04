import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { IntelligenceCard } from "@/components/cards/intelligence-card";
import { TopicCard } from "@/components/cards/topic-card";
import { FeedFilterDrawer } from "@/components/filters/feed-filter-drawer";
import { AccountCard } from "@/components/home/account-card";
import { BackToTopButton } from "@/components/layout/back-to-top-button";
import { SearchResultsHeader } from "@/components/search/search-results-header";
import {
  getFeedPageData,
  type DiscussionDigestData,
  type FeedFilters as FeedFiltersInput,
  type SearchTabKey,
} from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "搜索结果 | RegScope",
  description: "按情报、账号、领域和讨论分类查看 RegScope 搜索结果。",
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
  const tabs: Array<{ key: SearchTabKey; label: string; count: number; href: string }> = [
    { key: "all", label: "综合", count: data.tabCounts.all },
    { key: "intelligence", label: "情报", count: data.tabCounts.intelligence },
    { key: "accounts", label: "账号", count: data.tabCounts.accounts },
    { key: "topics", label: "领域", count: data.tabCounts.topics },
    { key: "discussions", label: "问答", count: data.tabCounts.discussions },
  ].map((tab) => ({
    ...tab,
    href: buildTabHref(filters, tab.key),
  }));

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      <SearchResultsHeader
        query={data.query}
        total={data.total}
        activeTab={data.activeTab}
        tabs={tabs}
      />

      {data.activeTab === "intelligence" ? (
        <FeedFilterDrawer
          current={filters}
          groups={[
            { label: "国家 / 地区", key: "country", items: data.filters.countries },
            { label: "官方来源", key: "source", items: data.filters.sources },
            { label: "领域", key: "topic", items: data.filters.topics },
            { label: "内容类型", key: "contentType", items: data.filters.contentTypes },
            { label: "时间范围", key: "timeRange", items: data.filters.timeRanges },
          ]}
        />
      ) : null}

      {data.activeTab === "all" ? (
        <div style={{ display: "grid", gap: "20px" }}>
          <ResultSection title="情报结果" count={data.items.length}>
            <div className="regscope-grid-five">
              {data.items.slice(0, 5).map((item) => (
                <IntelligenceCard key={item.slug} {...item} />
              ))}
            </div>
          </ResultSection>

          <ResultSection title="账号结果" count={data.accountResults.length}>
            <div className="regscope-grid-three">
              {data.accountResults.slice(0, 3).map((item) => (
                <AccountCard key={`${item.targetType}-${item.slug}`} {...item} />
              ))}
            </div>
          </ResultSection>

          <ResultSection title="领域结果" count={data.topicResults.length}>
            <div className="regscope-grid-three">
              {data.topicResults.slice(0, 3).map((item) => (
                <TopicCard key={item.slug} {...item} />
              ))}
            </div>
          </ResultSection>

          <ResultSection title="问答结果" count={data.discussionResults.length}>
            <div style={{ display: "grid", gap: "14px" }}>
              {data.discussionResults.slice(0, 3).map((item) => (
                <DiscussionResultCard key={item.slug} discussion={item} />
              ))}
            </div>
          </ResultSection>
        </div>
      ) : null}

      {data.activeTab === "intelligence" ? (
        <ResultSection title="情报结果" count={data.items.length}>
          {data.items.length > 0 ? (
            <div className="regscope-grid-five">
              {data.items.map((item) => (
                <IntelligenceCard key={item.slug} {...item} />
              ))}
            </div>
          ) : (
            <EmptyState text="没有匹配的情报结果，试试切换筛选条件。" />
          )}
        </ResultSection>
      ) : null}

      {data.activeTab === "accounts" ? (
        <ResultSection title="账号结果" count={data.accountResults.length}>
          {data.accountResults.length > 0 ? (
            <div className="regscope-grid-three">
              {data.accountResults.map((item) => (
                <AccountCard key={`${item.targetType}-${item.slug}`} {...item} />
              ))}
            </div>
          ) : (
            <EmptyState text="没有找到匹配的账号，换个关键词试试。" />
          )}
        </ResultSection>
      ) : null}

      {data.activeTab === "topics" ? (
        <ResultSection title="领域结果" count={data.topicResults.length}>
          {data.topicResults.length > 0 ? (
            <div className="regscope-grid-three">
              {data.topicResults.map((item) => (
                <TopicCard key={item.slug} {...item} />
              ))}
            </div>
          ) : (
            <EmptyState text="没有找到匹配的领域，试试更宽泛的主题词。" />
          )}
        </ResultSection>
      ) : null}

      {data.activeTab === "discussions" ? (
        <ResultSection title="问答结果" count={data.discussionResults.length}>
          {data.discussionResults.length > 0 ? (
            <div style={{ display: "grid", gap: "14px" }}>
              {data.discussionResults.map((item) => (
                <DiscussionResultCard key={item.slug} discussion={item} />
              ))}
            </div>
          ) : (
            <EmptyState text="没有找到匹配的问题或结论。" />
          )}
        </ResultSection>
      ) : null}

      <BackToTopButton />
    </div>
  );
}

function ResultSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section style={{ display: "grid", gap: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <span style={{ color: "var(--muted)", fontSize: "0.92rem" }}>{count} 条</span>
      </div>
      {children}
    </section>
  );
}

function DiscussionResultCard({ discussion }: { discussion: DiscussionDigestData }) {
  return (
    <article
      style={{
        border: "1px solid var(--border)",
        borderRadius: "24px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,248,252,0.96))",
        boxShadow: "0 12px 30px rgba(31, 55, 90, 0.05)",
        padding: "18px 20px",
        display: "grid",
        gap: "10px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <span
          style={{
            width: "fit-content",
            borderRadius: "999px",
            padding: "6px 10px",
            background: "rgba(31, 79, 134, 0.08)",
            color: "var(--accent)",
            fontSize: "0.8rem",
            fontWeight: 700,
          }}
        >
          {discussion.status}
        </span>
        <span style={{ color: "var(--muted)", fontSize: "0.88rem" }}>{discussion.updatedAtLabel}</span>
      </div>
      <Link href={discussion.href} style={{ color: "inherit", textDecoration: "none" }}>
        <strong style={{ display: "block", fontSize: "1.04rem", lineHeight: 1.45 }}>{discussion.title}</strong>
      </Link>
      <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{discussion.summary}</p>
      <p style={{ margin: 0, lineHeight: 1.75 }}>
        <strong>当前结论：</strong>
        {discussion.conclusion}
      </p>
      <span style={{ color: "var(--muted)", fontSize: "0.92rem" }}>
        {discussion.answerCount} 条回答 · {discussion.evidenceCount} 条证据
      </span>
    </article>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        border: "1px dashed rgba(20, 77, 122, 0.22)",
        borderRadius: "24px",
        padding: "28px",
        background: "rgba(255,255,255,0.75)",
        color: "var(--muted)",
      }}
    >
      {text}
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
    tab: normalizeTab(first(searchParams.tab)),
  };
}

function normalizeTab(value?: string): SearchTabKey {
  if (value === "intelligence" || value === "accounts" || value === "topics" || value === "discussions") {
    return value;
  }

  return "all";
}

function buildTabHref(filters: FeedFiltersInput, tab: SearchTabKey) {
  const params = new URLSearchParams();

  if (filters.query) {
    params.set("query", filters.query);
  }

  if (tab !== "all") {
    params.set("tab", tab);
  }

  if (tab === "intelligence") {
    if (filters.country) {
      params.set("country", filters.country);
    }
    if (filters.source) {
      params.set("source", filters.source);
    }
    if (filters.topic) {
      params.set("topic", filters.topic);
    }
    if (filters.contentType) {
      params.set("contentType", filters.contentType);
    }
    if (filters.timeRange) {
      params.set("timeRange", filters.timeRange);
    }
  }

  const query = params.toString();
  return query ? `/feed?${query}` : "/feed";
}

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}
