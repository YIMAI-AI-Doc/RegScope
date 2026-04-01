import React from "react";
import Link from "next/link";
import type { AccountCardData, TopicGroupData } from "@/lib/content/queries";
import { AccountCard } from "@/components/home/account-card";
import { TopicBrowser } from "@/components/topics/topic-browser";

type HomeAccountTopicSectionProps = {
  accounts: AccountCardData[];
  topicGroups: TopicGroupData[];
};

export function HomeAccountTopicSection({ accounts, topicGroups }: HomeAccountTopicSectionProps) {
  return (
    <section
      style={{
        border: "1px solid var(--border)",
        borderRadius: "32px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(239,245,249,0.95))",
        boxShadow: "0 18px 42px rgba(31, 55, 90, 0.07)",
        padding: "24px",
        display: "grid",
        gap: "22px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "end", flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: "8px" }}>
          <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}>账号与领域</p>
          <h2 style={{ margin: 0, fontSize: "clamp(1.5rem, 3vw, 2.15rem)", lineHeight: 1.12 }}>
            账号负责关注对象，领域负责知识结构
          </h2>
          <p style={{ margin: 0, maxWidth: "64ch", color: "var(--muted)", lineHeight: 1.75 }}>
            国家、地区、官方机构设计成账号形式；领域按大领域和小领域展开，避免把不同对象强行做成同一种卡片。
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link href="/sources" style={{ color: "var(--accent)", fontWeight: 700 }}>查看账号目录</Link>
          <Link href="/topics" style={{ color: "var(--accent)", fontWeight: 700 }}>查看领域目录</Link>
        </div>
      </div>

      <section style={{ display: "grid", gap: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <h3 style={{ margin: 0 }}>账号</h3>
          <span style={{ color: "var(--muted)", fontSize: "0.92rem" }}>{accounts.length} 个可关注对象</span>
        </div>
        <div className="regscope-grid-three">
          {accounts.map((account) => (
            <AccountCard key={`${account.targetType}-${account.slug}`} {...account} />
          ))}
        </div>
      </section>

      <TopicBrowser groups={topicGroups} mode="home" />
    </section>
  );
}
