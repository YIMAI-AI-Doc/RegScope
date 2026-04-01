import React from "react";
import Link from "next/link";
import type { SearchTabKey } from "@/lib/content/queries";

type TabItem = {
  key: SearchTabKey;
  label: string;
  count: number;
  href: string;
};

type SearchResultsHeaderProps = {
  query: string;
  total: number;
  activeTab: SearchTabKey;
  tabs: TabItem[];
};

export function SearchResultsHeader({ query, total, activeTab, tabs }: SearchResultsHeaderProps) {
  const heading = query ? `“${query}” 的搜索结果` : "RegScope 搜索结果";

  return (
    <section style={{ display: "grid", gap: "14px" }}>
      <div style={{ display: "grid", gap: "8px" }}>
        <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}>搜索结果</p>
        <h1 style={{ margin: 0, fontSize: "clamp(1.65rem, 3.4vw, 2.55rem)", lineHeight: 1.06 }}>{heading}</h1>
        <p style={{ margin: 0, maxWidth: "62ch", color: "var(--muted)", lineHeight: 1.7, fontSize: "0.94rem" }}>
          综合查看情报、账号、领域和讨论问答。筛选情报时，使用下方的隐藏式抽拉筛选层。
        </p>
      </div>

      <form action="/feed" method="get" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {activeTab !== "all" ? <input type="hidden" name="tab" value={activeTab} /> : null}
        <input
          type="search"
          name="query"
          defaultValue={query}
          placeholder="搜索监管情报、账号、领域或问题"
          aria-label="搜索内容"
          style={{
            flex: "1 1 420px",
            minWidth: "260px",
            border: "1px solid var(--border)",
            borderRadius: "16px",
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
          }}
        >
          搜索
        </button>
      </form>

      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", borderBottom: "1px solid rgba(104, 132, 171, 0.18)", paddingBottom: "8px", flex: 1 }}>
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <Link
                key={tab.key}
                href={tab.href}
                style={{
                  display: "inline-flex",
                  gap: "6px",
                  alignItems: "center",
                  color: isActive ? "var(--accent)" : "var(--muted)",
                  fontWeight: isActive ? 800 : 600,
                  paddingBottom: "4px",
                  borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    borderRadius: "999px",
                    background: isActive ? "rgba(31, 79, 134, 0.1)" : "rgba(31, 79, 134, 0.06)",
                    padding: "2px 6px",
                    fontSize: "0.72rem",
                    color: "inherit",
                  }}
                >
                  {tab.count}
                </span>
              </Link>
            );
          })}
        </div>
        <span style={{ color: "var(--muted)", fontSize: "0.88rem" }}>{total} 条情报结果</span>
      </div>
    </section>
  );
}
