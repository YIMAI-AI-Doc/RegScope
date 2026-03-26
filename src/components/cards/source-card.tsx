import React from "react";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { CatalogCardData } from "@/lib/content/queries";

type SourceCardProps = CatalogCardData;

export function SourceCard({ href, label, note, badge, summary }: SourceCardProps) {
  return (
    <Link
      href={href}
      style={{
        border: "1px solid var(--border)",
        borderRadius: "20px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,246,253,0.95))",
        boxShadow: "0 12px 30px rgba(31, 55, 90, 0.05)",
        padding: "18px",
        display: "grid",
        gap: "12px",
        minHeight: "170px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "start" }}>
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: "var(--accent)" }}>{label}</p>
          <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: "0.9rem" }}>{note}</p>
        </div>
        {badge ? <span style={badgeStyle}>{badge}</span> : null}
      </div>
      <p style={{ margin: 0, color: "var(--text)", lineHeight: 1.7 }}>{summary}</p>
    </Link>
  );
}

const badgeStyle: CSSProperties = {
  borderRadius: "999px",
  padding: "5px 9px",
  background: "rgba(31, 79, 134, 0.08)",
  color: "var(--accent)",
  fontWeight: 700,
  fontSize: "0.78rem",
  whiteSpace: "nowrap",
};
