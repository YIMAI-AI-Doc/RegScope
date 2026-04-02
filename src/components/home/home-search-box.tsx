"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const EMPTY_QUERY_MESSAGE = "请输入关键词后再搜索，例如：FDA 483、临床试验。";
const SUBMITTING_MESSAGE = "正在跳转到搜索结果...";

export function HomeSearchBox() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isError, setIsError] = useState(false);

  const keepFocus = () => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const setEmptyFeedback = () => {
    setFeedback(EMPTY_QUERY_MESSAGE);
    setIsError(true);
    keepFocus();
  };

  const setSubmittingFeedback = () => {
    setFeedback(SUBMITTING_MESSAGE);
    setIsError(false);
    keepFocus();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = query.trim();

    if (!normalized) {
      setEmptyFeedback();
      return;
    }

    setSubmittingFeedback();
    router.push(`/feed?query=${encodeURIComponent(normalized)}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    if (query.trim()) {
      setSubmittingFeedback();
      return;
    }

    event.preventDefault();
    setEmptyFeedback();
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    if (feedback) {
      setFeedback("");
      setIsError(false);
    }
  };

  return (
    <section style={{ display: "grid", gap: "12px", justifyItems: "center" }}>
      <p
        style={{
          margin: 0,
          color: "var(--muted)",
          fontSize: "1.84rem",
          fontWeight: 700,
          letterSpacing: "0.04em",
          lineHeight: 1.15,
        }}
      >
        全球医药法规情报平台
      </p>
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
          value={query}
          placeholder="例如：FDA 483、临床试验、CMC、AI 医疗器械"
          aria-label="首页搜索关键词"
          onKeyDown={handleKeyDown}
          onChange={handleQueryChange}
          style={{
            flex: "1 1 420px",
            minWidth: "260px",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            padding: "12px 14px",
            fontSize: "0.96rem",
            background: "rgba(255,255,255,0.96)",
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
    </section>
  );
}
