"use client";

import React, { useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import type { TopicGroupData } from "@/lib/content/queries";

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
            </div>
          </div>
        </div>

        <div className="regscope-topic-grid">
          {filteredChildren.length > 0 ? (
            filteredChildren.map((topic) => {
              const isFollowing = Boolean(followingByTopicSlug[topic.slug]);
              const isPendingThisTopic = isFollowPending && pendingTopicSlug === topic.slug;

              return (
                <article
                  key={topic.slug}
                  className="topic-subcard"
                  style={{
                    borderRadius: "16px",
                    padding: "12px 10px",
                    background: "linear-gradient(135deg, #0f5f78, #1d4c73)",
                    color: "#fff",
                    display: "grid",
                    gap: "6px",
                    minHeight: "99px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "start" }}>
                    <Link href={topic.href} style={{ color: "#fff" }}>
                      <strong style={{ lineHeight: 1.25, fontSize: "0.94rem" }}>{topic.label}</strong>
                    </Link>
                    <button
                      type="button"
                      className="topic-card-follow-plus"
                      onClick={() => handleFollowToggle(topic.slug, topic.label)}
                      disabled={isPendingThisTopic}
                      aria-label={isFollowing ? `取消关注 ${topic.label}` : `关注 ${topic.label}`}
                      title={isFollowing ? "取消关注该小领域" : "关注该小领域"}
                    >
                      {isPendingThisTopic ? "…" : isFollowing ? "✓" : "+"}
                    </button>
                  </div>
                  <p style={{ margin: 0, lineHeight: 1.45, opacity: 0.9, fontSize: "0.82rem" }}>{topic.summary}</p>
                  {followErrorByTopicSlug[topic.slug] ? (
                    <p style={{ margin: 0, color: "#ffd6d1", fontSize: "0.72rem" }}>{followErrorByTopicSlug[topic.slug]}</p>
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
