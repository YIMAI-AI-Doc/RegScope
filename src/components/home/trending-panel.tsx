import React from "react";

const trendingItems = [
  { label: "美国 FDA", detail: "12 条更新" },
  { label: "数字化与 AI 监管", detail: "9 个关注" },
  { label: "欧盟 EMA", detail: "7 条更新" },
] as const;

export function TrendingPanel() {
  return (
    <section
      style={{
        border: "1px solid var(--border)",
        borderRadius: "22px",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(243,246,251,0.98))",
        boxShadow: "0 12px 30px rgba(31, 55, 90, 0.06)",
        padding: "22px 24px",
      }}
    >
      <p style={{ margin: 0, fontWeight: 700, color: "var(--accent)" }}>趋势榜单</p>
      <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
        {trendingItems.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              padding: "12px 14px",
              borderRadius: "14px",
              background: "rgba(31, 79, 134, 0.04)",
            }}
          >
            <span style={{ fontWeight: 600 }}>{item.label}</span>
            <span style={{ color: "var(--muted)" }}>{item.detail}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
