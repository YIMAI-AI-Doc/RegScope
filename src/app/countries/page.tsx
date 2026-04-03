import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { IntelligenceCard } from "@/components/cards/intelligence-card";
import { getCountryDirectoryData } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "国家地区 | RegScope",
  description: "浏览不同国家和地区的医药监管动态。",
};

export default async function CountriesPage() {
  const data = await getCountryDirectoryData();

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <section style={{ display: "grid", gap: "10px" }}>
        <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}>国家地区</p>
        <h1 style={{ margin: 0, fontSize: "clamp(1.9rem, 4vw, 3rem)", lineHeight: 1.1 }}>{data.title}</h1>
        <p style={{ margin: 0, maxWidth: "66ch", color: "var(--muted)", lineHeight: 1.8 }}>{data.summary}</p>
      </section>

      <section style={{ display: "grid", gap: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>国家卡片</h2>
          <span style={{ color: "var(--muted)" }}>{data.cards.length} 项</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", columnGap: "14px", rowGap: "24px" }}>
          {data.cards.map((card) => (
            <CatalogCard key={card.slug} {...card} />
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>最新内容</h2>
          <Link href="/feed" style={{ color: "var(--accent)", fontWeight: 700 }}>
            查看全部快讯
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
          {data.latestContent.map((item) => (
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

function CatalogCard({
  href,
  label,
  note,
  badge,
  summary,
}: {
  href: string;
  label: string;
  note: string;
  badge?: string;
  summary: string;
}) {
  return (
    <Link
      href={href}
      style={{
        border: "1px solid var(--border)",
        borderRadius: "20px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,248,252,0.95))",
        boxShadow: "0 12px 30px rgba(31, 55, 90, 0.05)",
        padding: "18px",
        display: "grid",
        gap: "12px",
        minHeight: "170px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "start" }}>
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: "var(--accent)" }}>{label}</p>
          <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: "0.9rem" }}>{note}</p>
        </div>
        {badge ? (
          <span
            style={{
              borderRadius: "999px",
              padding: "5px 9px",
              background: "rgba(31, 79, 134, 0.08)",
              color: "var(--accent)",
              fontWeight: 700,
              fontSize: "0.78rem",
              whiteSpace: "nowrap",
            }}
          >
            {badge}
          </span>
        ) : null}
      </div>
      <p style={{ margin: 0, color: "var(--text)", lineHeight: 1.7 }}>{summary}</p>
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
