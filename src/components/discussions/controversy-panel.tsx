import React from "react";
import type { DiscussionControversyData } from "@/lib/discussions/queries";

type ControversyPanelProps = DiscussionControversyData;

export function ControversyPanel({ title, summary, points }: ControversyPanelProps) {
  return (
    <section
      style={{
        border: "1px solid var(--border)",
        borderRadius: "24px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,246,241,0.96))",
        boxShadow: "0 14px 34px rgba(31, 55, 90, 0.06)",
        padding: "22px 24px",
        display: "grid",
        gap: "16px",
      }}
    >
      <div>
        <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700 }}>{title}</p>
        <h2 style={{ margin: "6px 0 0" }}>把分歧和缺口单独挑出来</h2>
      </div>

      <p style={{ margin: 0, lineHeight: 1.8 }}>{summary}</p>

      <ul style={{ margin: 0, paddingLeft: "20px", display: "grid", gap: "8px", lineHeight: 1.75 }}>
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  );
}
