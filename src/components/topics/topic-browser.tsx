"use client";

import React, { useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import type { TopicGroupData } from "@/lib/content/queries";

const TOPIC_CARD_PALETTES = [
  { accent: "#b64a37", soft: "#f6e3d8", glow: "rgba(182, 74, 55, 0.22)" },
  { accent: "#1d8e7d", soft: "#dcf3ee", glow: "rgba(29, 142, 125, 0.2)" },
  { accent: "#2f73b6", soft: "#dcecff", glow: "rgba(47, 115, 182, 0.22)" },
  { accent: "#8462d7", soft: "#e8ddff", glow: "rgba(132, 98, 215, 0.2)" },
  { accent: "#cf7a19", soft: "#f8e8d1", glow: "rgba(207, 122, 25, 0.2)" },
  { accent: "#bc4e7d", soft: "#f6dde8", glow: "rgba(188, 78, 125, 0.2)" },
];

function getTopicBadgeText(label: string) {
  const normalized = label.replace(/\s+/g, "").trim();

  if (!normalized) {
    return "专题";
  }

  if (/^[A-Za-z]/.test(normalized)) {
    return normalized.slice(0, Math.min(3, normalized.length)).toUpperCase();
  }

  return normalized.slice(0, Math.min(2, normalized.length));
}

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
  const [followingByTopicSlug, setFollowingByTopicSlug] = useState<Record<string, boolean>>({});
  const [followErrorByTopicSlug, setFollowErrorByTopicSlug] = useState<Record<string, string>>({});
  const [pendingTopicSlug, setPendingTopicSlug] = useState("");
  const [isFollowPending, startFollowTransition] = useTransition();

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

  const handleFollowToggle = (topicSlug: string, topicLabel: string) => {
    const nextFollowState = !Boolean(followingByTopicSlug[topicSlug]);
    setFollowErrorByTopicSlug((current) => ({ ...current, [topicSlug]: "" }));
    setPendingTopicSlug(topicSlug);
    startFollowTransition(async () => {
      try {
        const response = await fetch("/api/follows", {
          method: nextFollowState ? "POST" : "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ targetType: "TOPIC", slug: topicSlug, name: topicLabel }),
        });

        if (response.status === 401) {
          const callbackUrl = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.href = `/api/auth/signin?callbackUrl=${callbackUrl}`;
          return;
        }

        if (!response.ok) {
          setFollowErrorByTopicSlug((current) => ({
            ...current,
            [topicSlug]: "关注操作失败，请稍后重试。",
          }));
          return;
        }

        setFollowingByTopicSlug((current) => ({
          ...current,
          [topicSlug]: nextFollowState,
        }));
      } catch {
        setFollowErrorByTopicSlug((current) => ({
          ...current,
          [topicSlug]: "关注操作失败，请稍后重试。",
        }));
      } finally {
        setPendingTopicSlug("");
      }
    });
  };

  if (!selectedGroup) {
    return null;
  }

  return (
    <section style={{ display: "grid", gap: "16px" }}>
      <div style={{ display: "grid", gap: "8px", justifyItems: "stretch" }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "470px",
              minWidth: "220px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              boxSizing: "border-box",
              border: "1px solid #b8b8b8",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.96)",
              overflow: "hidden",
            }}
          >
            <input
              ref={inputRef}
              type="search"
              name="query"
              value={draftQuery}
              onChange={handleQueryChange}
              onKeyDown={handleKeyDown}
              placeholder="例如：临床试验、CMC 与生产、标签与说明书、药物警戒"
              aria-label="搜索想关注的领域"
              style={{
                flex: 1,
                minWidth: 0,
                height: "100%",
                boxSizing: "border-box",
                border: "none",
                outline: "none",
                padding: "0 16px",
                fontSize: "0.96rem",
                background: "transparent",
                color: "var(--text)",
              }}
            />
            <button
              type="submit"
              style={{
                height: "calc(100% - 8px)",
                margin: "4px",
                border: "none",
                borderRadius: "999px",
                background: "rgba(0, 0, 0, 0.04)",
                color: "#000",
                padding: "0 18px",
                fontWeight: 700,
                cursor: "pointer",
                flex: "0 0 auto",
              }}
            >
              搜索
            </button>
          </div>
        </form>

        {feedback ? (
          <p
            aria-live="polite"
            style={{
              margin: "-2px 2px 0 auto",
              minHeight: "1.2em",
              color: isError ? "#b42318" : "var(--muted)",
              fontSize: "0.86rem",
              textAlign: "right",
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
            </div>
          </div>
        </div>

        <div className="regscope-topic-grid">
          {filteredChildren.length > 0 ? (
            filteredChildren.map((topic, index) => {
              const isFollowing = Boolean(followingByTopicSlug[topic.slug]);
              const isPendingThisTopic = isFollowPending && pendingTopicSlug === topic.slug;
              const palette = TOPIC_CARD_PALETTES[index % TOPIC_CARD_PALETTES.length];
              const cardStyle = {
                "--topic-accent": palette.accent,
                "--topic-soft": palette.soft,
                "--topic-glow": palette.glow,
              } as React.CSSProperties;

              return (
                <article key={topic.slug} className="topic-subcard" style={cardStyle}>
                  <button
                    type="button"
                    className="topic-card-follow-plus"
                    onClick={() => handleFollowToggle(topic.slug, topic.label)}
                    disabled={isPendingThisTopic}
                    data-following={isFollowing ? "true" : "false"}
                    aria-label={isFollowing ? `取消关注 ${topic.label}` : `关注 ${topic.label}`}
                    title={isFollowing ? "取消关注该小领域" : "关注该小领域"}
                  >
                    {isPendingThisTopic ? "…" : isFollowing ? "✓" : "+"}
                  </button>
                  <Link href={topic.href} className="topic-subcard-link" style={{ color: "inherit" }}>
                    <div className="topic-subcard-badge" aria-hidden="true">
                      <span className="topic-subcard-badge-text">{getTopicBadgeText(topic.label)}</span>
                    </div>
                    <div className="topic-subcard-copy">
                      <strong className="topic-subcard-title">{topic.label}</strong>
                      <p className="topic-subcard-summary">{topic.summary}</p>
                    </div>
                  </Link>
                  {followErrorByTopicSlug[topic.slug] ? (
                    <p className="topic-subcard-error">{followErrorByTopicSlug[topic.slug]}</p>
                  ) : null}
                </article>
              );
            })
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
