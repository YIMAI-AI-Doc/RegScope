"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const PLACEHOLDER = "例如：FDA 483、临床试验、CMC、AI 医疗器械";

export function SiteGlobalSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = query.trim();

    if (!normalized) {
      inputRef.current?.focus();
      return;
    }

    router.push(`/feed?query=${encodeURIComponent(normalized)}`);
  };

  return (
    <form className="site-global-search" role="search" aria-label="全站搜索" onSubmit={handleSubmit}>
      <span className="site-global-search-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M10.5 3.75a6.75 6.75 0 0 1 5.37 10.84l4.77 4.77a.75.75 0 1 1-1.06 1.06l-4.77-4.77A6.75 6.75 0 1 1 10.5 3.75Zm0 1.5a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <input
        ref={inputRef}
        type="search"
        name="query"
        value={query}
        placeholder={PLACEHOLDER}
        aria-label="全站搜索关键词"
        onChange={(event) => setQuery(event.target.value)}
        className="site-global-search-input"
      />
    </form>
  );
}
