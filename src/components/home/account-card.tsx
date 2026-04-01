import React from "react";
import Link from "next/link";
import type { AccountCardData } from "@/lib/content/queries";
import { FollowToggleButton } from "@/components/follows/follow-toggle-button";

type AccountCardProps = AccountCardData;

export function AccountCard({
  href,
  label,
  note,
  summary,
  badge,
  targetType,
  slug,
  recentCountLabel,
}: AccountCardProps) {
  return (
    <article
      style={{
        border: "1px solid var(--border)",
        borderRadius: "24px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(241,246,251,0.96))",
        boxShadow: "0 16px 36px rgba(31, 55, 90, 0.06)",
        padding: "18px",
        display: "grid",
        gap: "14px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "start" }}>
        <div style={{ display: "grid", gap: "6px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            <span style={{ fontWeight: 800, color: "var(--accent)", lineHeight: 1.35 }}>{label}</span>
            {badge ? (
              <span
                style={{
                  borderRadius: "999px",
                  padding: "4px 8px",
                  background: "rgba(31, 79, 134, 0.08)",
                  color: "var(--accent)",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                }}
              >
                {badge}
              </span>
            ) : null}
          </div>
          <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{note}</span>
        </div>
        <FollowToggleButton slug={slug} targetType={targetType} compact />
      </div>

      <p style={{ margin: 0, color: "var(--text)", lineHeight: 1.75 }}>{summary}</p>

      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ color: "var(--muted)", fontSize: "0.86rem" }}>{recentCountLabel}</span>
        <Link href={href} style={{ color: "var(--accent)", fontWeight: 700 }}>
          查看全部内容
        </Link>
      </div>
    </article>
  );
}
