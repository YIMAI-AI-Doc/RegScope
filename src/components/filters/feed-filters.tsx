import React from "react";
import Link from "next/link";
import type { SmallCardData } from "@/lib/content/queries";

type FeedFiltersProps = {
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

export function FeedFilters({ current, groups }: FeedFiltersProps) {
  return (
    <section
      style={{
        border: "1px solid var(--border)",
        borderRadius: "24px",
        background: "rgba(255,255,255,0.86)",
        boxShadow: "0 12px 30px rgba(31, 55, 90, 0.05)",
        padding: "20px 22px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: "var(--accent)" }}>筛选情报</p>
          <p style={{ margin: "6px 0 0", color: "var(--muted)", lineHeight: 1.7 }}>
            按国家、来源、领域、类型和时间范围快速缩小范围。
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gap: "18px", marginTop: "18px" }}>
        {groups.map((group) => (
          <div key={group.key}>
            <p style={{ margin: "0 0 10px", fontWeight: 700, color: "var(--text)" }}>{group.label}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {group.items.map((item) => {
                const isActive = current[group.key] === item.slug;

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
    </section>
  );
}
