import React from "react";
import type { DiscussionConclusionData } from "@/lib/discussions/queries";

type ConclusionPanelProps = {
  conclusion: DiscussionConclusionData | null;
};

export function ConclusionPanel({ conclusion }: ConclusionPanelProps) {
  return (
    <section
      style={{
        border: "1px solid var(--border)",
        borderRadius: "24px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,248,253,0.95))",
        boxShadow: "0 14px 34px rgba(31, 55, 90, 0.06)",
        padding: "22px 24px",
        display: "grid",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700 }}>当前结论</p>
          <h2 style={{ margin: "6px 0 0" }}>阶段性判断会随着新证据更新</h2>
        </div>
        {conclusion ? (
          <span
            style={{
              alignSelf: "start",
              borderRadius: "999px",
              padding: "6px 10px",
              background: "rgba(31, 79, 134, 0.08)",
              color: "var(--accent)",
              fontSize: "0.84rem",
              whiteSpace: "nowrap",
            }}
          >
            {conclusion.updatedAtLabel}
          </span>
        ) : null}
      </div>

      {conclusion ? (
        <>
          <p style={{ margin: 0, lineHeight: 1.8 }}>{conclusion.summary}</p>
          {conclusion.evidenceNote ? (
            <p style={{ margin: 0, lineHeight: 1.75, color: "var(--muted)" }}>
              <strong>结论提示：</strong>
              {conclusion.evidenceNote}
            </p>
          ) : null}
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.92rem" }}>
            由 {conclusion.updatedByLabel} 更新
          </p>
        </>
      ) : (
        <div
          style={{
            border: "1px dashed var(--border)",
            borderRadius: "18px",
            padding: "18px",
            background: "rgba(31, 79, 134, 0.03)",
          }}
        >
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            当前还没有正式结论。建议先查看证据列表和高票回复，后续结论会在这里持续更新。
          </p>
        </div>
      )}
    </section>
  );
}
