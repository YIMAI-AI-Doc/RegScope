import React from "react";
import Link from "next/link";
import type { DiscussionDigestData } from "@/lib/content/queries";

type HomeDiscussionSectionProps = {
  discussions: DiscussionDigestData[];
};

export function HomeDiscussionSection({ discussions }: HomeDiscussionSectionProps) {
  return (
    <section style={{ display: "grid", gap: "18px" }}>
      <div style={{ display: "grid", gap: "10px" }}>
        <div>
          <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}>讨论摘要</p>
          <h2 style={{ margin: "4px 0 0", fontSize: "clamp(1.3rem, 2.2vw, 1.75rem)", lineHeight: 1.2 }}>
            精选讨论摘要
          </h2>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link href="/discussions" style={{ color: "var(--accent)", fontWeight: 700 }}>进入讨论问答</Link>
        </div>
      </div>

      <div style={{ display: "grid", gap: "14px" }}>
        {discussions.map((discussion) => (
          <article
            key={discussion.slug}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "26px",
              background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,248,252,0.96))",
              boxShadow: "0 14px 32px rgba(31, 55, 90, 0.06)",
              padding: "20px 22px",
            }}
          >
            <div style={{ display: "grid", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <span
                  style={{
                    width: "fit-content",
                    borderRadius: "999px",
                    padding: "6px 10px",
                    background: "rgba(31, 79, 134, 0.08)",
                    color: "var(--accent)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  {discussion.status}
                </span>
                <span style={{ color: "var(--muted)", fontSize: "0.88rem" }}>{discussion.updatedAtLabel}</span>
              </div>
              <h3 style={{ margin: 0, fontSize: "1.08rem", lineHeight: 1.45 }}>
                <Link href={discussion.href} style={{ color: "inherit" }}>
                  {discussion.title}
                </Link>
              </h3>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.75 }}>{discussion.summary}</p>
              <p style={{ margin: 0, lineHeight: 1.75 }}>
                <strong>当前结论：</strong>
                {discussion.conclusion}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ color: "var(--muted)", fontSize: "0.92rem" }}>
                  {discussion.answerCount} 条回答 · {discussion.evidenceCount} 条证据
                </span>
                <Link href={discussion.href} style={{ color: "var(--accent)", fontWeight: 700 }}>
                  查看讨论详情
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
