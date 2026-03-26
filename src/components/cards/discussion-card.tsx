import React from "react";
import Link from "next/link";
import type { DiscussionListItemData } from "@/lib/discussions/queries";

type DiscussionCardProps = DiscussionListItemData;

const toneStyles = {
  blue: "rgba(31, 79, 134, 0.10)",
  amber: "rgba(178, 109, 21, 0.12)",
  violet: "rgba(95, 71, 140, 0.10)",
  green: "rgba(19, 113, 86, 0.10)",
  slate: "rgba(77, 96, 125, 0.10)",
} as const;

export function DiscussionCard({
  href,
  title,
  summary,
  conclusion,
  statusLabel,
  statusDescription,
  evidenceCount,
  answerCount,
  countryLabel,
  topicLabel,
  updatedAtLabel,
}: DiscussionCardProps) {
  return (
    <article
      style={{
        border: "1px solid var(--border)",
        borderRadius: "24px",
        background: "var(--panel-strong)",
        boxShadow: "0 14px 34px rgba(31, 55, 90, 0.07)",
      }}
    >
      <Link
        href={href}
        style={{
          color: "inherit",
          display: "grid",
          gap: "14px",
          padding: "20px 22px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              borderRadius: "999px",
              padding: "6px 10px",
              background: toneStyles.slate,
              color: "var(--accent)",
              fontSize: "0.8rem",
              fontWeight: 700,
            }}
          >
            {statusLabel}
          </span>
          <span style={{ color: "var(--muted)", fontSize: "0.88rem" }}>{updatedAtLabel}</span>
        </div>

        <div style={{ display: "grid", gap: "8px" }}>
          <h3 style={{ margin: 0, fontSize: "1.08rem", lineHeight: 1.45 }}>{title}</h3>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{summary}</p>
        </div>

        <p style={{ margin: 0, lineHeight: 1.75 }}>
          <strong>当前结论：</strong>
          {conclusion}
        </p>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Pill>{countryLabel}</Pill>
          <Pill>{topicLabel}</Pill>
          <Pill>{statusDescription}</Pill>
        </div>

        <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.92rem" }}>
          {evidenceCount} 条证据 · {answerCount} 条回答
        </p>
      </Link>
    </article>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        borderRadius: "999px",
        padding: "6px 10px",
        background: "rgba(31, 79, 134, 0.06)",
        color: "var(--accent)",
        fontWeight: 600,
        fontSize: "0.8rem",
      }}
    >
      {children}
    </span>
  );
}
