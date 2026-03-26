import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { IntelligenceCard } from "@/components/cards/intelligence-card";
import { SourceCard } from "@/components/cards/source-card";
import { TopicCard } from "@/components/cards/topic-card";
import { getTopicPageData } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "领域详情 | RegScope",
  description: "查看某个监管领域的最新内容、相关来源和讨论摘要。",
};

type TopicPageProps = {
  params?: Promise<{ slug: string }> | { slug: string };
};

export default async function TopicDetailPage({ params }: TopicPageProps) {
  const { slug } = await Promise.resolve(params ?? { slug: "" });
  const data = await getTopicPageData(slug);

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <section
        style={{
          border: "1px solid var(--border)",
          borderRadius: "28px",
          background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(245,249,254,0.96))",
          padding: "24px",
          boxShadow: "0 16px 34px rgba(31, 55, 90, 0.08)",
          display: "grid",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700 }}>领域详情</p>
            <h1 style={{ margin: "8px 0 0", fontSize: "clamp(1.9rem, 4vw, 3rem)", lineHeight: 1.1 }}>
              {data.topic.label}
            </h1>
          </div>
          <Link
            href={data.topic.href}
            style={{
              alignSelf: "start",
              borderRadius: "999px",
              border: "1px solid var(--border)",
              padding: "10px 14px",
              color: "var(--accent)",
              fontWeight: 700,
            }}
          >
            关注该领域
          </Link>
        </div>
        <p style={{ margin: 0, maxWidth: "68ch", color: "var(--muted)", lineHeight: 1.8 }}>{data.topic.summary}</p>
      </section>

      <section style={{ display: "grid", gap: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>细分关注点</h2>
          <span style={{ color: "var(--muted)" }}>{data.subtopics.length} 项</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
          {data.subtopics.map((subtopic) => (
            <TopicCard key={subtopic.slug} {...subtopic} />
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>最新内容</h2>
          <Link href={`/feed?topic=${data.topic.slug}`} style={{ color: "var(--accent)", fontWeight: 700 }}>
            查看该领域快讯
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
          {data.latestContent.map((item) => (
            <IntelligenceCard key={item.slug} {...item} />
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>相关来源</h2>
          <span style={{ color: "var(--muted)" }}>{data.relatedSources.length} 项</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
          {data.relatedSources.map((source) => (
            <SourceCard key={source.slug} {...source} />
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: "12px" }}>
        <h2 style={{ margin: 0 }}>相关讨论</h2>
        {data.relatedDiscussions.map((discussion) => (
          <DiscussionDigestCard key={discussion.slug} {...discussion} />
        ))}
      </section>
    </div>
  );
}

function DiscussionDigestCard({
  href,
  title,
  summary,
  conclusion,
  status,
  evidenceCount,
  answerCount,
  updatedAtLabel,
}: {
  href: string;
  title: string;
  summary: string;
  conclusion: string;
  status: string;
  evidenceCount: number;
  answerCount: number;
  updatedAtLabel: string;
}) {
  return (
    <Link
      href={href}
      style={{
        border: "1px solid var(--border)",
        borderRadius: "20px",
        background: "var(--panel-strong)",
        padding: "18px 20px",
        display: "grid",
        gap: "10px",
        boxShadow: "0 12px 28px rgba(31, 55, 90, 0.05)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <h3 style={{ margin: 0, fontSize: "1.02rem" }}>{title}</h3>
        <span style={{ color: "var(--muted)", fontSize: "0.88rem" }}>{updatedAtLabel}</span>
      </div>
      <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{summary}</p>
      <p style={{ margin: 0, lineHeight: 1.75 }}>
        <strong>当前结论：</strong>
        {conclusion}
      </p>
      <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.92rem" }}>
        {status} · {evidenceCount} 条证据 · {answerCount} 条回答
      </p>
    </Link>
  );
}
