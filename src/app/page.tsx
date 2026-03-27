import React from "react";
import Link from "next/link";
import { AlertStrip } from "@/components/home/alert-strip";
import { FollowCenterPanel } from "@/components/home/follow-center-panel";
import { TrendingPanel } from "@/components/home/trending-panel";
import { IntelligenceCard } from "@/components/cards/intelligence-card";
import { getHomepageData } from "@/lib/content/queries";

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <div style={{ display: "grid", gap: "28px" }}>
      <section
        style={{
          display: "grid",
          gap: "10px",
          padding: "6px 0 4px",
        }}
      >
        <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}>
          REGSCOPE
        </p>
        <h1 style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 3.4rem)", lineHeight: 1.08 }}>
          全球医药监管情报，按主题订阅，按结论阅读。
        </h1>
        <p style={{ margin: 0, maxWidth: "62ch", color: "var(--muted)", lineHeight: 1.8 }}>
          聚合全球官方政策、行业解读和讨论结论，先看重点，再按国家、机构和领域下钻。
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.3fr) minmax(300px, 0.9fr)",
          gap: "18px",
        }}
      >
        <AlertStrip title={data.alert.title} summary={data.alert.summary} meta={data.alert.meta} />
        <FollowCenterPanel />
      </section>

      <section style={{ display: "grid", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "16px" }}>
          <div>
            <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700 }}>最新情报</p>
            <h2 style={{ margin: "6px 0 0" }}>优先展示最新、最相关、最值得追踪的更新</h2>
          </div>
          <Link
            href="/feed"
            style={{ color: "var(--accent)", fontWeight: 700, whiteSpace: "nowrap" }}
          >
            查看全部快讯
          </Link>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "18px",
          }}
        >
          {data.featuredCards.map((card) => (
            <IntelligenceCard key={card.slug} {...card} />
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: "18px" }}>
        <div>
          <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700 }}>结构化入口</p>
          <h2 style={{ margin: "6px 0 0" }}>官方来源、细分领域和国家地区小卡片</h2>
        </div>
        <div style={{ display: "grid", gap: "18px" }}>
          <SmallCardSection title="官方来源" items={data.officialSources} />
          <SmallCardSection title="关注领域" items={data.topicCards} />
          <SmallCardSection title="国家地区" items={data.countryCards} />
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.25fr) minmax(300px, 0.75fr)",
          gap: "18px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: "24px",
            background: "var(--panel-strong)",
            padding: "22px 24px",
            boxShadow: "0 12px 30px rgba(31, 55, 90, 0.06)",
          }}
        >
          <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700 }}>精选讨论摘要</p>
          <div style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
            {data.discussions.map((discussion) => (
              <article
                key={discussion.slug}
                style={{
                  border: "1px solid rgba(31, 79, 134, 0.08)",
                  borderRadius: "18px",
                  background: "rgba(31, 79, 134, 0.04)",
                  padding: "18px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      borderRadius: "999px",
                      padding: "5px 10px",
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
                <h3 style={{ margin: "12px 0 0", fontSize: "1.04rem" }}>
                  <Link href={discussion.href} style={{ color: "inherit", textDecoration: "none" }}>
                    {discussion.title}
                  </Link>
                </h3>
                <p style={{ margin: "8px 0 0", lineHeight: 1.7, color: "var(--muted)" }}>
                  {discussion.summary}
                </p>
                <p style={{ margin: "10px 0 0", lineHeight: 1.75 }}>
                  <strong>当前结论：</strong>
                  {discussion.conclusion}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.92rem" }}>
                    {discussion.answerCount} 条回答 · {discussion.evidenceCount} 条证据
                  </p>
                  <Link href={discussion.href} style={{ color: "var(--accent)", fontWeight: 700 }}>
                    进入讨论
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
        <TrendingPanel />
      </section>
    </div>
  );
}

type SmallCardSectionProps = {
  title: string;
  items: {
    slug: string;
    href: string;
    label: string;
    note: string;
    badge?: string;
  }[];
};

function SmallCardSection({ title, items }: SmallCardSectionProps) {
  return (
    <section
      style={{
        border: "1px solid var(--border)",
        borderRadius: "24px",
        background: "rgba(255,255,255,0.82)",
        padding: "20px 22px",
        boxShadow: "0 12px 30px rgba(31, 55, 90, 0.05)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span style={{ color: "var(--muted)" }}>{items.length} 项</span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "12px",
          marginTop: "16px",
        }}
      >
        {items.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "18px",
              background: "var(--panel-strong)",
              padding: "16px",
              display: "grid",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "10px" }}>
              <strong style={{ lineHeight: 1.4 }}>{item.label}</strong>
              {item.badge ? (
                <span
                  style={{
                    borderRadius: "999px",
                    padding: "4px 8px",
                    background: "rgba(31, 79, 134, 0.08)",
                    color: "var(--accent)",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                  }}
                >
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{item.note}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
