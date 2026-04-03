"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const EMPTY_QUERY_MESSAGE = "请输入关键词后再搜索，例如：AI 申报路径、CMC 变更、电子知情同意。";
const SUBMITTING_MESSAGE = "正在跳转到讨论搜索结果...";

export function DiscussionSearchBar() {
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = query.trim();

    if (!normalized) {
      setFeedback(EMPTY_QUERY_MESSAGE);
      setIsError(true);
      keepFocus();
      return;
    }

    setFeedback(SUBMITTING_MESSAGE);
    setIsError(false);
    keepFocus();
    router.push(`/feed?tab=discussions&query=${encodeURIComponent(normalized)}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    if (query.trim()) {
      setFeedback(SUBMITTING_MESSAGE);
      setIsError(false);
      return;
    }

    event.preventDefault();
    setFeedback(EMPTY_QUERY_MESSAGE);
    setIsError(true);
    keepFocus();
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    if (feedback) {
      setFeedback("");
      setIsError(false);
    }
  };

  return (
    <section style={{ display: "grid", gap: "8px", justifyItems: "stretch", width: "100%" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          width: "100%",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <input
          ref={inputRef}
          type="search"
          name="query"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          placeholder="例如：AI 申报路径、CMC 变更、电子知情同意"
          aria-label="搜索讨论问题"
          style={{
            flex: "0 1 380px",
            width: "100%",
            minWidth: "220px",
            boxSizing: "border-box",
            height: "40px",
            border: "1px solid var(--border)",
            borderRadius: "999px",
            padding: "0 16px",
            fontSize: "0.96rem",
            background: "rgba(255,255,255,0.96)",
            color: "var(--text)",
          }}
        />
        <button
          type="submit"
          style={{
            boxSizing: "border-box",
            height: "40px",
            border: "1px solid #b8b8b8",
            borderRadius: "999px",
            background: "transparent",
            color: "#000",
            padding: "0 18px",
            fontWeight: 700,
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
    </section>
  );
}
