import React from "react";

export function PetTierBadge({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        borderRadius: "999px",
        padding: "6px 10px",
        border: "1px solid rgba(104, 132, 171, 0.18)",
        background: "rgba(255,255,255,0.68)",
        color: "var(--accent)",
        fontSize: "0.8rem",
        fontWeight: 800,
        letterSpacing: "0.06em",
      }}
    >
      {label}
    </span>
  );
}
