"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { TopicGroupData } from "@/lib/content/queries";
import { FollowToggleButton } from "@/components/follows/follow-toggle-button";

type TopicBrowserProps = {
  groups: TopicGroupData[];
  mode?: "home" | "directory";
};

export function TopicBrowser({ groups, mode = "home" }: TopicBrowserProps) {
  const [selectedGroupSlug, setSelectedGroupSlug] = useState(groups[0]?.slug ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [draftQuery, setDraftQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isError, setIsError] = useState(false);

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

  const keepFocus = () => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = draftQuery.trim();

    if (!normalized) {
      setFeedback("请输入关键词后再搜索，例如：去中心化临床、RWE、eCTD。");
      setIsError(true);
      keepFocus();
      return;
    }

    setQuery(normalized);
    setFeedback("已按关键词筛选当前领域。");
    setIsError(false);
    keepFocus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    if (draftQuery.trim()) {
      setFeedback("已按关键词筛选当前领域。");
      setIsError(false);
      return;
    }

    event.preventDefault();
    setFeedback("请输入关键词后再搜索，例如：去中心化临床、RWE、eCTD。");
    setIsError(true);
    keepFocus();
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDraftQuery(event.target.value);

    if (feedback) {
      setFeedback("");
      setIsError(false);
    }
  };

  if (!selectedGroup) {
    return null;
  }

  return (
    <section style={{ display: "grid", gap: "16px" }}>
      <div style={{ display: "grid", gap: "8px", justifyItems: "center" }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            width: "min(100%, 760px)",
            justifyContent: "center",
          }}
        >
          <input
            ref={inputRef}
            type="search"
            name="query"
            value={draftQuery}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            placeholder="例如：FDA 483、临床试验、CMC、AI 医疗器械"
            aria-label="搜索想关注的领域"
            style={{
              flex: "1 1 420px",
              minWidth: "260px",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "12px 14px",
              fontSize: "0.96rem",
              background: "rgba(255,255,255,0.96)",
              color: "var(--text)",
            }}
          />
          <button
            type="submit"
            style={{
              border: "none",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #124f80, #207c79)",
              color: "#fff",
              padding: "0 18px",
              fontWeight: 700,
              minHeight: "46px",
              cursor: "pointer",
            }}
          >
            搜索
          </button>
        </form>

        {feedback ? (
          <p
            aria-live="polite"
            style={{
              margin: "-2px 2px 0",
              minHeight: "1.2em",
              color: isError ? "#b42318" : "var(--muted)",
              fontSize: "0.86rem",
            }}
          >
            {feedback}
          </p>
        ) : null}
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
