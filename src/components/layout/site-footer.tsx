import React from "react";

export function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        marginTop: "32px",
        padding: "20px 32px 36px",
        color: "var(--muted)",
        fontSize: "0.92rem",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <p style={{ margin: 0, fontWeight: 600, color: "var(--text)" }}>
          RegScope
        </p>
        <p style={{ margin: "6px 0 0", lineHeight: 1.7 }}>
          汇聚全球医药监管政策、来源和讨论结论，帮助用户更快找到重点。
        </p>
      </div>
    </footer>
  );
}
