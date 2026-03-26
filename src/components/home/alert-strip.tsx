import React from "react";

type AlertStripProps = {
  title?: string;
  summary?: string;
  meta?: string;
};

export function AlertStrip({
  title = "今日监管预警",
  summary = "FDA、EMA、NMPA 等来源的高优先级更新会优先展示在这里。",
  meta = "按国家 / 机构 / 领域追踪",
}: AlertStripProps) {
  return (
    <section
      style={{
        border: "1px solid rgba(31, 79, 134, 0.14)",
        borderRadius: "22px",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(228,237,248,0.92))",
        boxShadow: "0 18px 40px rgba(31, 55, 90, 0.08)",
        padding: "22px 24px",
      }}
    >
      <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
        <div
          style={{
            width: "54px",
            height: "54px",
            borderRadius: "18px",
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(135deg, #1f4f86, #2f6aa8)",
            color: "#fff",
            fontSize: "1.2rem",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          !
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700 }}>
            {title}
          </p>
          <p style={{ margin: "6px 0 0", fontSize: "1.02rem", lineHeight: 1.7 }}>
            {summary}
          </p>
          <p style={{ margin: "8px 0 0", color: "var(--muted)", fontSize: "0.92rem" }}>
            {meta}
          </p>
        </div>
      </div>
    </section>
  );
}
