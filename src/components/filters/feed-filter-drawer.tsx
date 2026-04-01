"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { SmallCardData } from "@/lib/content/queries";

type FeedFilterDrawerProps = {
  current: {
    country?: string;
    source?: string;
    topic?: string;
    contentType?: string;
    timeRange?: string;
  };
  groups: {
    label: string;
    items: SmallCardData[];
    key: "country" | "source" | "topic" | "contentType" | "timeRange";
  }[];
};

export function FeedFilterDrawer({ current, groups }: FeedFilterDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <section
      style={{
        border: "1px solid var(--border)",
        borderRadius: "24px",
        background: "rgba(255,255,255,0.9)",
        boxShadow: "0 12px 30px rgba(31, 55, 90, 0.05)",
        padding: "16px 18px",
        display: "grid",
        gap: "14px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: "var(--accent)" }}>筛选情报</p>
          <p style={{ margin: "6px 0 0", color: "var(--muted)", lineHeight: 1.7 }}>
            默认收起，需要时再抽拉展开，保持结果区域更聚焦。
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          style={{
            border: "1px solid var(--border)",
            borderRadius: "999px",
            background: open ? "rgba(31, 79, 134, 0.08)" : "#fff",
            color: open ? "var(--accent)" : "var(--text)",
            padding: "10px 14px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {open ? "收起筛选" : "更多筛选"}
        </button>
      </div>

      {open ? (
        <div className="regscope-filter-groups">
          {groups.map((group) => (
            <div key={group.key} style={{ display: "grid", gap: "10px" }}>
              <p style={{ margin: 0, fontWeight: 700 }}>{group.label}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {group.items.map((item) => {
                  const isAllItem = item.slug.startsWith("all-");
                  const isActive = isAllItem ? !current[group.key] : current[group.key] === item.slug;

                  return (
                    <Link
                      key={item.slug}
                      href={item.href}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        borderRadius: "999px",
                        border: isActive ? "1px solid var(--accent)" : "1px solid var(--border)",
                        background: isActive ? "rgba(31, 79, 134, 0.08)" : "white",
                        color: isActive ? "var(--accent)" : "var(--text)",
                        padding: "9px 14px",
                        fontSize: "0.92rem",
                        fontWeight: isActive ? 700 : 600,
                      }}
                    >
                      <span>{item.label}</span>
                      {item.badge ? (
                        <span
                          style={{
                            borderRadius: "999px",
                            background: isActive ? "rgba(31, 79, 134, 0.14)" : "rgba(31, 79, 134, 0.06)",
                            padding: "3px 7px",
                            fontSize: "0.74rem",
                            color: "inherit",
                          }}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
