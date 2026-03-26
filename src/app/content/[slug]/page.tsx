import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { IntelligenceCard } from "@/components/cards/intelligence-card";
import { getContentPageData } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "内容详情 | RegScope",
  description: "查看监管情报的摘要、正文、原文链接和相关内容。",
};

type ContentPageProps = {
  params?: Promise<{ slug: string }> | { slug: string };
};

export default async function ContentPage({ params }: ContentPageProps) {
  const { slug } = await Promise.resolve(params ?? { slug: "" });
  const data = await getContentPageData(slug);

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <article
        style={{
          border: "1px solid var(--border)",
          borderRadius: "28px",
          background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,249,254,0.96))",
          padding: "24px",
          boxShadow: "0 16px 34px rgba(31, 55, 90, 0.08)",
          display: "grid",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <span
            style={{
              borderRadius: "999px",
              padding: "6px 10px",
              background: "rgba(31, 79, 134, 0.08)",
              color: "var(--accent)",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            {data.content.contentTypeLabel}
          </span>
          <span style={{ color: "var(--muted)" }}>{data.content.publishedAtLabel}</span>
        </div>
        <h1 style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.12 }}>{data.content.title}</h1>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.8, maxWidth: "72ch" }}>{data.content.summary}</p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            paddingTop: "4px",
          }}
        >
          <MetaLink href={data.content.sourceHref} label={data.content.sourceName} />
          <MetaLink href={data.content.countryHref} label={data.content.countryName} />
          <MetaLink href={data.content.topicHref} label={data.content.topicName} />
        </div>
      </article>

      <section
        style={{
          border: "1px solid var(--border)",
          borderRadius: "24px",
          background: "var(--panel-strong)",
          padding: "22px 24px",
          display: "grid",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>正文 / 提取内容</h2>
          <Link href={data.content.canonicalUrl} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontWeight: 700 }}>
            打开原文
          </Link>
        </div>
        <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.85, color: "var(--text)" }}>{data.content.body}</p>
      </section>

      <section style={{ display: "grid", gap: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>相关内容</h2>
          <Link href="/feed" style={{ color: "var(--accent)", fontWeight: 700 }}>
            浏览更多快讯
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
          {data.relatedContent.map((item) => (
            <IntelligenceCard key={item.slug} {...item} />
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

function MetaLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        borderRadius: "999px",
        border: "1px solid var(--border)",
        background: "rgba(31, 79, 134, 0.05)",
        color: "var(--accent)",
        padding: "8px 12px",
        fontWeight: 700,
      }}
    >
      {label}
    </Link>
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
