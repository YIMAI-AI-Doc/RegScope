"use client";

import React, { useState, useTransition } from "react";

type FollowToggleButtonProps = {
  slug: string;
  targetType: "SOURCE" | "COUNTRY" | "TOPIC";
  initialFollowing?: boolean;
  compact?: boolean;
};

export function FollowToggleButton({
  slug,
  targetType,
  initialFollowing = false,
  compact = false,
}: FollowToggleButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const response = await fetch("/api/follows", {
        method: isFollowing ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetType, slug }),
      });

      if (response.status === 401) {
        const callbackUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/api/auth/signin?callbackUrl=${callbackUrl}`;
        return;
      }

      if (!response.ok) {
        setError("操作失败");
        return;
      }

      setIsFollowing((current) => !current);
    });
  }

  return (
    <div style={{ display: "grid", gap: "6px", justifyItems: compact ? "start" : "stretch" }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        style={{
          border: isFollowing ? "1px solid rgba(20, 86, 136, 0.18)" : "1px solid transparent",
          borderRadius: "999px",
          background: isFollowing ? "rgba(20, 86, 136, 0.08)" : "linear-gradient(135deg, #124f80, #207c79)",
          color: isFollowing ? "#124f80" : "#fff",
          padding: compact ? "8px 12px" : "9px 14px",
          fontWeight: 700,
          fontSize: compact ? "0.84rem" : "0.9rem",
          cursor: isPending ? "wait" : "pointer",
          whiteSpace: "nowrap",
        }}
      >
        {isPending ? "提交中..." : isFollowing ? "已关注" : "关注"}
      </button>
      {error ? (
        <span style={{ color: "#9b2c2c", fontSize: "0.78rem" }}>{error}</span>
      ) : null}
    </div>
  );
}
