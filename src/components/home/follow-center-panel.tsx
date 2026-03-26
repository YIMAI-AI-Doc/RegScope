import React from "react";

type FollowCenterPanelProps = {
  isLoggedIn?: boolean;
};

export function FollowCenterPanel({
  isLoggedIn = false,
}: FollowCenterPanelProps) {
  const title = isLoggedIn ? "我的关注中心" : "关注中心";
  const description = isLoggedIn
    ? "你关注的国家、机构、领域会在这里统一汇总。"
    : "登录后可以关注国家、机构、大领域和小领域，接收站内提醒。";
  const cta = isLoggedIn ? "管理关注" : "登录后关注";
  const badge = isLoggedIn ? "已登录" : "游客模式";

  return (
    <section
      style={{
        border: "1px solid var(--border)",
        borderRadius: "22px",
        background: "var(--panel-strong)",
        boxShadow: "0 12px 30px rgba(31, 55, 90, 0.06)",
        padding: "22px 24px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: "var(--accent)" }}>{title}</p>
          <p style={{ margin: "8px 0 0", lineHeight: 1.7, color: "var(--text)" }}>
            {description}
          </p>
        </div>
        <span
          style={{
            alignSelf: "start",
            padding: "6px 10px",
            borderRadius: "999px",
            background: "rgba(31, 79, 134, 0.08)",
            color: "var(--accent)",
            fontSize: "0.84rem",
            whiteSpace: "nowrap",
          }}
        >
          {badge}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "18px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          style={{
            border: "none",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #1f4f86, #2f6aa8)",
            color: "#fff",
            padding: "10px 16px",
            fontWeight: 600,
          }}
        >
          {cta}
        </button>
        <button
          type="button"
          style={{
            border: "1px solid var(--border)",
            borderRadius: "12px",
            background: "transparent",
            color: "var(--text)",
            padding: "10px 16px",
            fontWeight: 600,
          }}
        >
          查看订阅结构
        </button>
      </div>
    </section>
  );
}
