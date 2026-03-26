import React from "react";
import Link from "next/link";
import type { IntelligenceCardData } from "@/lib/content/queries";

const accentMap = {
  blue: {
    cover: "linear-gradient(135deg, #173b6d, #3f74b0)",
    chip: "rgba(255,255,255,0.18)",
  },
  teal: {
    cover: "linear-gradient(135deg, #0f5d52, #2a8a7e)",
    chip: "rgba(255,255,255,0.18)",
  },
  amber: {
    cover: "linear-gradient(135deg, #8a4d10, #d98a2b)",
    chip: "rgba(255,255,255,0.18)",
  },
  violet: {
    cover: "linear-gradient(135deg, #4a356d, #7d5ca8)",
    chip: "rgba(255,255,255,0.18)",
  },
} as const;

type IntelligenceCardProps = IntelligenceCardData;

export function IntelligenceCard({
  href,
  title,
  summary,
  sourceName,
  countryName,
  topicName,
  contentTypeLabel,
  publishedAtLabel,
  accent,
}: IntelligenceCardProps) {
  const accentStyles = accentMap[accent];

  return (
    <article
      style={{
        border: "1px solid var(--border)",
        borderRadius: "24px",
        overflow: "hidden",
        background: "var(--panel-strong)",
        boxShadow: "0 16px 36px rgba(31, 55, 90, 0.08)",
        transition: "transform 180ms ease, box-shadow 180ms ease",
      }}
    >
      <Link href={href} style={{ color: "inherit", display: "block" }}>
        <div
          style={{
            aspectRatio: "16 / 9",
            background: `${accentStyles.cover}`,
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
            <span
              style={{
                padding: "6px 10px",
                borderRadius: "999px",
                background: accentStyles.chip,
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {contentTypeLabel}
            </span>
            <span style={{ fontSize: "0.84rem", opacity: 0.9 }}>{publishedAtLabel}</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.88 }}>{countryName}</p>
            <p style={{ margin: "6px 0 0", fontSize: "1.08rem", lineHeight: 1.4, fontWeight: 700 }}>
              {title}
            </p>
          </div>
        </div>
        <div style={{ padding: "18px 18px 20px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "12px",
              fontSize: "0.82rem",
            }}
          >
            <span style={pillStyle}>{sourceName}</span>
            <span style={pillStyle}>{topicName}</span>
          </div>
          <p style={{ margin: 0, lineHeight: 1.75, color: "var(--text)" }}>{summary}</p>
        </div>
      </Link>
    </article>
  );
}

const pillStyle: React.CSSProperties = {
  borderRadius: "999px",
  padding: "6px 10px",
  background: "rgba(31, 79, 134, 0.06)",
  color: "var(--accent)",
  fontWeight: 600,
};
