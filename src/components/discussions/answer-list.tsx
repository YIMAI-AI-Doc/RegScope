import React from "react";
import type { DiscussionAnswerData } from "@/lib/discussions/queries";

type AnswerListProps = {
  answers: DiscussionAnswerData[];
};

export function AnswerList({ answers }: AnswerListProps) {
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
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700 }}>回答</p>
          <h2 style={{ margin: "6px 0 0" }}>按证据标签优先看回复</h2>
        </div>
        <span style={{ color: "var(--muted)", alignSelf: "end" }}>{answers.length} 条</span>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {answers.length > 0 ? (
          answers.map((answer) => (
            <article
              key={answer.id}
              style={{
                borderRadius: "18px",
                background: answer.isAccepted ? "rgba(19, 113, 86, 0.06)" : "rgba(31, 79, 134, 0.04)",
                padding: "16px 18px",
                display: "grid",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ display: "grid", gap: "6px" }}>
                  <strong>{answer.authorLabel}</strong>
                  <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{answer.createdAtLabel}</span>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "start" }}>
                  <Chip>{answer.evidenceLabelText}</Chip>
                  {answer.isAccepted ? <Chip tone="green">已采纳</Chip> : null}
                </div>
              </div>

              <p style={{ margin: 0, lineHeight: 1.8 }}>{answer.body}</p>
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
            <p style={{ margin: 0, lineHeight: 1.8 }}>当前还没有回复。你可以先发起一个明确的问题，并附上相关证据。</p>
          </div>
        )}
      </div>
    </section>
  );
}

function Chip({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "green" }) {
  const background = tone === "green" ? "rgba(19, 113, 86, 0.10)" : "rgba(31, 79, 134, 0.08)";

  return (
    <span
      style={{
        borderRadius: "999px",
        padding: "6px 10px",
        background,
        color: "var(--accent)",
        fontSize: "0.8rem",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
