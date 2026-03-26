import React from "react";
import type { Metadata } from "next";
import { DiscussionCard } from "@/components/cards/discussion-card";
import { getDiscussionListData } from "@/lib/discussions/queries";

export const metadata: Metadata = {
  title: "讨论问答 | RegScope",
  description: "浏览 RegScope 的问题、结论、证据和回复。",
};

export default async function DiscussionsPage() {
  const data = await getDiscussionListData();

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <section style={{ display: "grid", gap: "10px" }}>
        <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}>讨论问答</p>
        <h1 style={{ margin: 0, fontSize: "clamp(1.9rem, 4vw, 3rem)", lineHeight: 1.1 }}>{data.title}</h1>
        <p style={{ margin: 0, maxWidth: "66ch", color: "var(--muted)", lineHeight: 1.8 }}>{data.summary}</p>
      </section>

      <section style={{ display: "grid", gap: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>问题列表</h2>
          <span style={{ color: "var(--muted)" }}>{data.items.length} 条</span>
        </div>
        <div style={{ display: "grid", gap: "14px" }}>
          {data.items.map((item) => (
            <DiscussionCard key={item.slug} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}
