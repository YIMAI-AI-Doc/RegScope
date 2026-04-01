"use client";

import React, { useMemo, useRef, useState } from "react";

type Props = {
  name: string;
  email: string;
  avatarUrl?: string | null;
};

export function ProfileAvatarCard({ name, email, avatarUrl }: Props) {
  const initials = useMemo(() => {
    const value = name || email || "U";
    return value.slice(0, 1).toUpperCase();
  }, [name, email]);

  const [preview, setPreview] = useState<string | null>(avatarUrl ?? null);
  const [status, setStatus] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      style={{
        display: "grid",
        gap: "14px",
        padding: "18px",
        borderRadius: "18px",
        border: "1px solid rgba(104,132,171,0.22)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,250,254,0.94))",
        boxShadow: "0 14px 32px rgba(31,55,90,0.10)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "999px",
            display: "grid",
            placeItems: "center",
            background:
              preview
                ? `center/cover no-repeat url(${preview})`
                : "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.92), rgba(31,79,134,0.18) 60%), linear-gradient(135deg, rgba(31,79,134,0.24), rgba(47,106,168,0.12))",
            border: "1px solid rgba(104,132,171,0.26)",
            color: "var(--accent)",
            fontWeight: 900,
            fontSize: "1.4rem",
            overflow: "hidden",
          }}
          aria-label="头像预览"
        >
          {!preview ? initials : null}
        </div>
        <div style={{ display: "grid", gap: "4px" }}>
          <strong style={{ fontSize: "1.1rem" }}>{name || "RegScope 用户"}</strong>
          <span style={{ color: "var(--muted)" }}>{email}</span>
          <small style={{ color: "var(--muted)" }}>头像仅本地预览，后端存储待接入</small>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid rgba(104,132,171,0.26)",
            background: "rgba(31,79,134,0.06)",
            color: "var(--accent)",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          更换头像
        </button>
        <button
          type="button"
          onClick={async () => {
            setStatus(null);
            setPreview(null);
            await fetch("/api/me/avatar", { method: "DELETE" });
            setStatus("已重置头像");
          }}
          style={{
            padding: "10px 12px",
            borderRadius: "10px",
            border: "1px solid rgba(104,132,171,0.14)",
            background: "transparent",
            color: "var(--muted)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          重置
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setStatus("上传中…");
            const reader = new FileReader();
            reader.onload = async () => {
              const dataUrl = reader.result?.toString() ?? null;
              if (!dataUrl) return;
              setPreview(dataUrl);
              const res = await fetch("/api/me/avatar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dataUrl }),
              });
              if (!res.ok) {
                const payload = await res.json().catch(() => ({}));
                setStatus(payload.error ?? "上传失败");
                return;
              }
              setStatus("已更新头像");
            };
            reader.readAsDataURL(file);
          }}
        />
      </div>

      {status ? <p style={{ margin: 0, color: "var(--muted)" }}>{status}</p> : null}
    </div>
  );
}
