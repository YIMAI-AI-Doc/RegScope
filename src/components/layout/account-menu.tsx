"use client";

import React, { useEffect, useMemo, useRef, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";

export type AccountMenuViewer = {
  isAuthenticated: boolean;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  avatarUrl?: string | null;
};

export type AccountMenuStats = {
  followCount: number;
  answerCount: number;
  discussionCount: number;
};

type AccountMenuProps = {
  viewer: AccountMenuViewer;
  stats: AccountMenuStats;
};

export function AccountMenu({ viewer, stats }: AccountMenuProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hoverCloseTimerRef = useRef<number | null>(null);
  const [stickyOpen, setStickyOpen] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "mist">("light");
  const [email, setEmail] = useState(viewer.email ?? "demo@regscope.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const displayName = viewer.isAuthenticated ? viewer.name ?? viewer.email ?? "RegScope 用户" : "游客";
  const initials = useMemo(() => {
    const value = (viewer.name ?? viewer.email ?? "G").trim();
    return value.length > 0 ? value.slice(0, 1).toUpperCase() : "G";
  }, [viewer.email, viewer.name]);
  const avatar = viewer.avatarUrl ?? null;

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        if (hoverCloseTimerRef.current) {
          window.clearTimeout(hoverCloseTimerRef.current);
          hoverCloseTimerRef.current = null;
        }
        setStickyOpen(false);
        setHoverOpen(false);
      }
    }
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem("regscope-theme");
    const nextTheme = stored === "mist" ? "mist" : "light";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverCloseTimerRef.current) {
        window.clearTimeout(hoverCloseTimerRef.current);
      }
    };
  }, []);

  function openHoverPanel() {
    if (hoverCloseTimerRef.current) {
      window.clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    }

    setHoverOpen(true);
  }

  function closeHoverPanelWithDelay() {
    if (hoverCloseTimerRef.current) {
      window.clearTimeout(hoverCloseTimerRef.current);
    }

    hoverCloseTimerRef.current = window.setTimeout(() => {
      setHoverOpen(false);
      hoverCloseTimerRef.current = null;
    }, 300);
  }

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      setError("登录失败：请确认账号是 @regscope.local，且密码正确。");
      return;
    }

    startTransition(() => {
      setStickyOpen(false);
      setHoverOpen(false);
      setPassword("");
      router.refresh();
    });
  }

  async function handleLogout() {
    setError(null);
    try {
      await signOut({ redirect: false });
    } catch {
      setError("退出登录失败，请稍后重试。");
      return;
    }

    startTransition(() => {
      setStickyOpen(false);
      setHoverOpen(false);
      router.refresh();
    });
  }

  const isOpen = stickyOpen || hoverOpen;

  return (
    <div
      ref={containerRef}
      className="account-menu"
      data-open={isOpen ? "true" : "false"}
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
      onMouseEnter={openHoverPanel}
      onMouseLeave={closeHoverPanelWithDelay}
    >
      <span className="account-touchpad" aria-hidden="true" />
      <button
        className="account-avatar-trigger"
        type="button"
        onClick={() => {
          setStickyOpen((value) => !value);
        }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        title={viewer.isAuthenticated ? "进入个人中心" : "登录"}
        style={{
          border: "1px solid rgba(104, 132, 171, 0.34)",
          width: "38px",
          height: "38px",
          borderRadius: "999px",
          display: "grid",
          placeItems: "center",
          background:
            viewer.isAuthenticated && avatar
              ? `center/cover no-repeat url(${avatar})`
              : viewer.isAuthenticated
              ? "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(31,79,134,0.16) 60%), linear-gradient(135deg, rgba(31,79,134,0.22), rgba(47,106,168,0.12))"
              : "linear-gradient(135deg, rgba(31,79,134,0.14), rgba(47,106,168,0.08))",
          color: "var(--accent)",
          fontWeight: 800,
          cursor: "pointer",
          position: "relative",
          zIndex: 1,
        }}
      >
        {!avatar ? <span style={{ fontSize: "0.95rem", letterSpacing: "0.02em" }}>{viewer.isAuthenticated ? initials : "客"}</span> : null}
      </button>

      {isOpen ? (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "100%",
            paddingTop: "12px",
            zIndex: 30,
          }}
        >
          <div
            role="menu"
            aria-label="账户面板"
            style={{
              width: "min(368px, calc(100vw - 32px))",
              borderRadius: "22px",
              border: "1px solid rgba(104, 132, 171, 0.26)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,248,253,0.96))",
              boxShadow: "0 18px 46px rgba(31, 55, 90, 0.16)",
              overflow: "hidden",
            }}
          >
          <div
            style={{
              padding: "18px 18px 14px",
              background:
                "radial-gradient(circle at 18% 10%, rgba(47,106,168,0.22), transparent 52%), radial-gradient(circle at 86% 0%, rgba(31,79,134,0.16), transparent 48%), linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.72))",
            }}
          >
            <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "999px",
                  display: "grid",
                  placeItems: "center",
                  background:
                    avatar
                      ? `center/cover no-repeat url(${avatar})`
                      : "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.92), rgba(31,79,134,0.20) 60%), linear-gradient(135deg, rgba(31,79,134,0.26), rgba(47,106,168,0.14))",
                  border: "1px solid rgba(104, 132, 171, 0.26)",
                  color: "var(--accent)",
                  fontWeight: 900,
                  fontSize: "1.2rem",
                  overflow: "hidden",
                }}
              >
                {!avatar ? (viewer.isAuthenticated ? initials : "客") : null}
              </div>
              <div style={{ display: "grid", gap: "4px", minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <strong style={{ fontSize: "1.05rem", lineHeight: 1.2, maxWidth: "22ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {displayName}
                  </strong>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "999px",
                      background: "rgba(31,79,134,0.10)",
                      color: "var(--accent)",
                      fontSize: "0.76rem",
                      fontWeight: 800,
                    }}
                  >
                    {viewer.isAuthenticated ? (viewer.role === "ADMIN" ? "管理员" : "已登录") : "游客模式"}
                  </span>
                </div>
                <span style={{ color: "var(--muted)", fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {viewer.isAuthenticated ? viewer.email : "登录后可同步你的关注与浏览推荐"}
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px", marginTop: "14px" }}>
              <Stat
                label="关注"
                value={stats.followCount}
                ariaLabel="管理关注"
                onActivate={() => {
                  setStickyOpen(false);
                  router.push("/me/follows");
                }}
              />
              <Stat label="回答" value={stats.answerCount} />
              <Stat label="讨论" value={stats.discussionCount} />
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(104, 132, 171, 0.18)", margin: "0 18px" }} />

          <div style={{ padding: "8px 18px 14px", display: "grid", gap: "12px" }}>
            {error ? <p style={{ margin: 0, color: "#b43a33", lineHeight: 1.6 }}>{error}</p> : null}

            {!viewer.isAuthenticated ? (
              <form onSubmit={handleLogin} style={{ display: "grid", gap: "10px" }}>
                <div style={{ display: "grid", gap: "8px" }}>
                  <label style={{ display: "grid", gap: "6px" }}>
                    <span style={{ color: "var(--muted)", fontSize: "0.84rem", fontWeight: 700 }}>邮箱</span>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="demo@regscope.local"
                      style={inputStyle}
                    />
                  </label>
                  <label style={{ display: "grid", gap: "6px" }}>
                    <span style={{ color: "var(--muted)", fontSize: "0.84rem", fontWeight: 700 }}>密码</span>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="默认 regscope，可用 .env 配置"
                      style={inputStyle}
                    />
                  </label>
                </div>

                <button type="submit" style={primaryButtonStyle}>
                  登录
                </button>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.84rem", lineHeight: 1.6 }}>
                  默认仅允许 `@regscope.local` 邮箱；密码来自 `REGSCOPE_DEMO_PASSWORD`（未设置则为 `regscope`）。
                </p>
              </form>
            ) : (
              null
            )}

            <div style={{ display: "grid", gap: "6px" }}>
              {viewer.isAuthenticated ? (
                <MenuRow
                  label="我的神兽"
                  hint="神兽图鉴与互动"
                  trailing=">"
                  tall
                  onActivate={() => {
                    setStickyOpen(false);
                    setHoverOpen(false);
                    router.push("/me");
                  }}
                />
              ) : null}
              {viewer.isAuthenticated ? (
                <MenuRow
                  label="个人中心"
                  hint="查看资料、收藏与互动"
                  trailing=">"
                  onActivate={() => {
                    setStickyOpen(false);
                    setHoverOpen(false);
                    router.push("/me");
                  }}
                />
              ) : null}
              <MenuRow
                label="主题"
                hint={theme === "light" ? "浅色" : "柔雾"}
                trailing="•"
                onActivate={() => {
                  const nextTheme = theme === "light" ? "mist" : "light";
                  setTheme(nextTheme);
                  applyTheme(nextTheme);
                  window.localStorage.setItem("regscope-theme", nextTheme);
                }}
              />
            </div>

            <div style={{ borderTop: "1px solid rgba(104, 132, 171, 0.18)" }} />

            {viewer.isAuthenticated ? (
              <button type="button" onClick={handleLogout} style={dangerButtonStyle}>
                退出登录
              </button>
            ) : null}
          </div>
        </div>
        </div>
      ) : null}
    </div>
  );
}

function applyTheme(theme: "light" | "mist") {
  const root = document.documentElement;
  if (theme === "light") {
    root.removeAttribute("data-theme");
    return;
  }
  root.setAttribute("data-theme", theme);
}

function Stat({
  label,
  value,
  onActivate,
  ariaLabel,
}: {
  label: string;
  value: number;
  onActivate?: () => void;
  ariaLabel?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const interactive = Boolean(onActivate);
  const isActive = hovered || focused;
  const highlightColor = "#0057b8";
  const valueColor = isActive ? highlightColor : "#687a95";
  const labelColor = isActive ? highlightColor : "#8a97ab";

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!interactive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onActivate?.();
    }
  }

  return (
    <div
      role={interactive ? "link" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? ariaLabel ?? label : undefined}
      onClick={interactive ? onActivate : undefined}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "6px 8px",
        textAlign: "center",
        display: "grid",
        gap: "2px",
        cursor: interactive ? "pointer" : "default",
        borderRadius: "10px",
        color: valueColor,
        background: "transparent",
        boxShadow: "none",
        transition: "color 0.12s ease, transform 0.12s ease",
        transform: isActive ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      <strong
        style={{
          fontSize: "1.05rem",
          color: valueColor,
          transition: "color 0.12s ease, transform 0.12s ease",
          transform: isActive ? "scale(1.08)" : "scale(1)",
        }}
      >
        {value}
      </strong>
      <span
        style={{
          color: labelColor,
          fontSize: "0.84rem",
          transition: "color 0.12s ease",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function MenuRow({
  label,
  hint,
  trailing,
  onActivate,
  tall,
}: {
  label: string;
  hint: string;
  trailing: string;
  onActivate?: () => void;
  tall?: boolean;
}) {
  return (
    <div
      role={onActivate ? "button" : undefined}
      tabIndex={onActivate ? 0 : undefined}
      onClick={onActivate}
      onKeyDown={(event) => {
        if (!onActivate) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onActivate();
        }
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        padding: tall ? "20px 10px" : "10px 10px",
        minHeight: tall ? "72px" : undefined,
        borderRadius: "14px",
        border: "1px solid rgba(104, 132, 171, 0.14)",
        background: "rgba(31,79,134,0.02)",
        cursor: onActivate ? "pointer" : "default",
      }}
    >
      <span style={{ fontWeight: 700 }}>{label}</span>
      <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
        {hint} {trailing}
      </span>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  borderRadius: "12px",
  border: "1px solid rgba(104, 132, 171, 0.26)",
  padding: "10px 12px",
  outline: "none",
  background: "rgba(255,255,255,0.82)",
};

const primaryButtonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #1f4f86, #2f6aa8)",
  color: "#fff",
  padding: "10px 16px",
  fontWeight: 800,
  cursor: "pointer",
};

const dangerButtonStyle: React.CSSProperties = {
  border: "1px solid rgba(180, 58, 51, 0.32)",
  borderRadius: "12px",
  background: "rgba(180, 58, 51, 0.08)",
  color: "#8f2f29",
  padding: "10px 16px",
  fontWeight: 800,
  cursor: "pointer",
};
