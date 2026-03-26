import React from "react";
import Link from "next/link";
import type { DiscussionEvidenceData } from "@/lib/discussions/queries";

type EvidenceListProps = {
  items: DiscussionEvidenceData[];
};

export function EvidenceList({ items }: EvidenceListProps) {
  return (
    <section
      style={{
        border: "1px solid var(--border)",
        borderRadius: "24px",
        background: "var(--panel-strong)",
        boxShadow: "0 14px 34px rgba(31, 55, 90, 0.06)",
        padding: "22px 24px",
        display: "grid",
        gap: "16px",
      }}
    >
      <div>
        <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700 }}>证据列表</p>
        <h2 style={{ margin: "6px 0 0" }}>按来源强度拆开看</h2>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {items.length > 0 ? (
          items.map((item) => (
            <article
              key={item.id}
              style={{
                borderRadius: "18px",
                background: "rgba(31, 79, 134, 0.04)",
                padding: "16px 18px",
                display: "grid",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ display: "grid", gap: "6px" }}>
                  {item.url ? (
                    <Link href={item.url} target="_blank" rel="noreferrer" style={{ fontWeight: 700, color: "inherit" }}>
                      {item.title}
                    </Link>
                  ) : (
                    <strong>{item.title}</strong>
                  )}
                  {item.note ? <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{item.note}</p> : null}
                </div>
                <span
                  style={{
                    borderRadius: "999px",
                    padding: "6px 10px",
                    background: "rgba(31, 79, 134, 0.08)",
                    color: "var(--accent)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    height: "fit-content",
                  }}
                >
                  {item.labelText}
                </span>
              </div>
              {item.url ? (
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>{item.url}</p>
              ) : null}
            </article>
          ))
        ) : (
          <div
            style={{
              border: "1px dashed var(--border)",
              borderRadius: "18px",
              padding: "18px",
              background: "rgba(31, 79, 134, 0.03)",
            }}
          >
            <p style={{ margin: 0, lineHeight: 1.8 }}>当前没有可展示的证据，后续可以从官方原文、解读和经验笔记补充。</p>
          </div>
        )}
      </div>
    </section>
  );
}
