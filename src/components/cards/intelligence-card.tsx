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
  sourceName,
  contentTypeLabel,
  publishedAtLabel,
  accent,
  coverImage,
}: IntelligenceCardProps) {
  const accentStyles = accentMap[accent];
  const cardHeight = "clamp(246px, 24vw, 272px)";
  const coverHeight = "clamp(124px, 13vw, 148px)";
  const coverBackground = coverImage
    ? `linear-gradient(135deg, rgba(9, 22, 43, 0.55), rgba(17, 45, 84, 0.28)), url(${coverImage})`
    : accentStyles.cover;

  return (
    <article
      style={{
        border: "1px solid var(--border)",
        borderRadius: "22px",
        overflow: "hidden",
        background: "var(--panel-strong)",
        boxShadow: "0 14px 30px rgba(31, 55, 90, 0.08)",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        height: cardHeight,
      }}
    >
      <Link href={href} style={{ color: "inherit", display: "flex", flexDirection: "column", height: "100%" }}>
        <div
          style={{
            height: coverHeight,
            backgroundImage: coverBackground,
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start" }}>
            <span
              style={{
                padding: "5px 9px",
                borderRadius: "999px",
                background: accentStyles.chip,
                fontSize: "0.78rem",
                fontWeight: 600,
              }}
            >
              {contentTypeLabel}
            </span>
          </div>
        </div>
        <div style={{ padding: "12px 14px 14px", display: "grid", gap: "17px", flex: 1, alignContent: "start" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.98rem",
              lineHeight: 1.45,
              fontWeight: 700,
              color: "var(--text)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              height: "2.9em",
              maxHeight: "2.9em",
            }}
          >
            {title}
          </p>
          <p
            style={{
              margin: 0,
              color: "var(--muted)",
              fontSize: "0.82rem",
              lineHeight: 1.35,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={`${sourceName} · ${publishedAtLabel}`}
          >
            {sourceName} · {publishedAtLabel}
          </p>
        </div>
      </Link>
    </article>
  );
}
