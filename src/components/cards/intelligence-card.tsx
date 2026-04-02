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
    <article className="intelligence-card" style={{ height: cardHeight }}>
      <div className="intelligence-card-shell">
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
      </div>

      <div className="intelligence-card-preview">
        <button type="button" className="intelligence-card-preview-trigger" aria-label={`预览 ${title}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M2.2 12s3.6-6 9.8-6 9.8 6 9.8 6-3.6 6-9.8 6-9.8-6-9.8-6Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3.1" fill="none" stroke="currentColor" strokeWidth="1.7" />
          </svg>
        </button>
        <div className="intelligence-card-preview-panel" role="tooltip" aria-label={`${title} 预览`}>
          <p className="intelligence-card-preview-label">内容预览</p>
          <p className="intelligence-card-preview-title">{title}</p>
          <p className="intelligence-card-preview-meta">
            {sourceName} · {publishedAtLabel}
          </p>
          <p className="intelligence-card-preview-summary">{summary}</p>
        </div>
      </div>
    </article>
  );
}
