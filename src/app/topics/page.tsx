import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { IntelligenceCard } from "@/components/cards/intelligence-card";
import { TopicBrowser } from "@/components/topics/topic-browser";
import { getTopicDirectoryData } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "领域订阅 | RegScope",
  description: "按大领域和小领域浏览全球医药监管领域，并查看最新相关内容。",
};

export default async function TopicsPage() {
  const data = await getTopicDirectoryData();

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <section style={{ display: "grid", gap: "10px" }}>
        <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}>领域订阅</p>
        <h1 style={{ margin: 0, fontSize: "clamp(1.9rem, 4vw, 3rem)", lineHeight: 1.1 }}>{data.title}</h1>
        <p style={{ margin: 0, maxWidth: "66ch", color: "var(--muted)", lineHeight: 1.8 }}>{data.summary}</p>
      </section>

      <TopicBrowser groups={data.topicGroups} mode="directory" />

      <section style={{ display: "grid", gap: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>最新内容</h2>
          <Link href="/feed?tab=intelligence" style={{ color: "var(--accent)", fontWeight: 700 }}>
            查看情报结果页
          </Link>
        </div>
        <div className="regscope-grid-three">
          {data.latestContent.map((item) => (
            <IntelligenceCard key={item.slug} {...item} />
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: "14px" }}>
        <h2 style={{ margin: 0 }}>相关讨论</h2>
        <div style={{ display: "grid", gap: "12px" }}>
          {data.relatedDiscussions.map((discussion) => (
            <DiscussionDigestCard key={discussion.slug} {...discussion} />
          ))}
        </div>
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
