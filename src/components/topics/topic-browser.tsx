"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { TopicGroupData } from "@/lib/content/queries";
import { FollowToggleButton } from "@/components/follows/follow-toggle-button";

type TopicBrowserProps = {
  groups: TopicGroupData[];
  mode?: "home" | "directory";
};

export function TopicBrowser({ groups, mode = "home" }: TopicBrowserProps) {
  const [selectedGroupSlug, setSelectedGroupSlug] = useState(groups[0]?.slug ?? "");
  const [query, setQuery] = useState("");

  const selectedGroup = groups.find((group) => group.slug === selectedGroupSlug) ?? groups[0];
  const filteredChildren = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const children = selectedGroup?.children ?? [];

    if (!normalized) {
      return children;
    }

    return children.filter((item) => {
      const haystack = `${item.label} ${item.note} ${item.summary}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query, selectedGroup]);

  if (!selectedGroup) {
    return null;
  }

  return (
    <section style={{ display: "grid", gap: "16px" }}>
      <div style={{ display: "grid", gap: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>{mode === "home" ? "领域结构" : "按大领域浏览"}</h3>
          {mode === "directory" ? (
            <span style={{ color: "var(--muted)", fontSize: "0.92rem" }}>{groups.length} 个大领域</span>
          ) : null}
        </div>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
          先选大领域，再进入下方小领域；搜索框只用于定位想关注的领域。
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {groups.map((group) => {
          const isActive = group.slug === selectedGroup.slug;
          return (
            <button
              key={group.slug}
              type="button"
              onClick={() => setSelectedGroupSlug(group.slug)}
              style={{
                border: isActive ? "1px solid transparent" : "1px solid rgba(20, 77, 122, 0.16)",
                borderRadius: "999px",
                background: isActive ? "linear-gradient(135deg, #124f80, #207c79)" : "#dceff6",
                color: isActive ? "#fff" : "#124f80",
                padding: "10px 16px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {group.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: mode === "home" ? "28px" : "24px",
          background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(238,245,249,0.96))",
          boxShadow: "0 16px 34px rgba(31, 55, 90, 0.06)",
          padding: "18px",
          display: "grid",
          gap: "16px",
        }}
      >
        <div style={{ display: "grid", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <strong style={{ display: "block", fontSize: "1.02rem" }}>{selectedGroup.label}</strong>
              <p style={{ margin: "6px 0 0", color: "var(--muted)", lineHeight: 1.7 }}>{selectedGroup.description}</p>
            </div>
            <FollowToggleButton slug={selectedGroup.slug} targetType="TOPIC" compact />
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索想关注的领域"
            aria-label="搜索想关注的领域"
            style={{
              width: "100%",
              border: "1px solid var(--border)",
              borderRadius: "999px",
              padding: "12px 16px",
              fontSize: "0.95rem",
              background: "rgba(255,255,255,0.94)",
              color: "var(--text)",
            }}
          />
        </div>

        <div className="regscope-topic-grid">
          {filteredChildren.length > 0 ? (
            filteredChildren.map((topic) => (
              <article
                key={topic.slug}
                style={{
                  borderRadius: "22px",
                  padding: "18px 16px",
                  background: "linear-gradient(135deg, #0f5f78, #1d4c73)",
                  color: "#fff",
                  display: "grid",
                  gap: "10px",
                  minHeight: "186px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "start" }}>
                  <strong style={{ lineHeight: 1.35 }}>{topic.label}</strong>
                  {topic.badge ? (
                    <span style={{ borderRadius: "999px", padding: "4px 8px", background: "rgba(255,255,255,0.16)", fontSize: "0.72rem", fontWeight: 700 }}>
                      {topic.badge}
                    </span>
                  ) : null}
                </div>
                <span style={{ fontSize: "0.84rem", opacity: 0.88 }}>{topic.note}</span>
                <p style={{ margin: 0, lineHeight: 1.6, opacity: 0.92 }}>{topic.summary}</p>
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <Link href={topic.href} style={{ color: "#fff", fontWeight: 700 }}>
                    查看相关内容
                  </Link>
                  <span style={{ fontSize: "0.82rem", opacity: 0.84 }}>小领域入口</span>
                </div>
              </article>
            ))
          ) : (
            <div
              style={{
                border: "1px dashed rgba(18, 77, 122, 0.2)",
                borderRadius: "22px",
                padding: "24px",
                background: "rgba(255,255,255,0.72)",
                color: "var(--muted)",
              }}
            >
              当前大领域下没有匹配的小领域，换个关键词试试。
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
