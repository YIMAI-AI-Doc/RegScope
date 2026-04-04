import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SourceCard } from "@/components/cards/source-card";
import { TopicCard } from "@/components/cards/topic-card";
import { BackToTopButton } from "@/components/layout/back-to-top-button";
import { getTopicPageData } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "领域详情 | RegScope",
  description: "查看某个监管领域的细分关注点与相关来源。",
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", columnGap: "14px", rowGap: "24px" }}>
          {data.subtopics.map((subtopic) => (
            <TopicCard key={subtopic.slug} {...subtopic} />
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>相关来源</h2>
          <span style={{ color: "var(--muted)" }}>{data.relatedSources.length} 项</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", columnGap: "14px", rowGap: "24px" }}>
          {data.relatedSources.map((source) => (
            <SourceCard key={source.slug} {...source} />
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: "12px" }}>
        <h2 style={{ margin: 0 }}>相关讨论</h2>
        <p style={{ margin: 0, color: "var(--muted)" }}>暂无讨论，欢迎在讨论区发起该话题。</p>
      </section>

      <BackToTopButton />
    </div>
  );
}
