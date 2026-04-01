"use client";

import React, { startTransition, useMemo, useState } from "react";
import type { DiscussionAnswerData, DiscussionPageData } from "@/lib/discussions/queries";

type AnswerListProps = {
  answers: DiscussionAnswerData[];
  viewer: DiscussionPageData["viewer"];
};

type SortMode = "recommended" | "votes" | "latest";

export function AnswerList({ answers, viewer }: AnswerListProps) {
  const [items, setItems] = useState(answers);
  const [sortMode, setSortMode] = useState<SortMode>("recommended");
  const [pendingAnswerId, setPendingAnswerId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sortedAnswers = useMemo(() => sortAnswers(items, sortMode), [items, sortMode]);

  function handleVote(answerId: string, nextVote: -1 | 1) {
    if (!viewer.canVote) {
      setErrorMessage("登录后才能参与投票。");
      return;
    }

    const current = items.find((item) => item.id === answerId);
    if (!current) {
      return;
    }

    const effectiveVote = current.viewerVote === nextVote ? 0 : nextVote;

    setPendingAnswerId(answerId);
    setErrorMessage(null);
    startTransition(async () => {
      try {
        const response = await fetch(`/api/answers/${answerId}/vote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ value: effectiveVote }),
        });

        if (!response.ok) {
          throw new Error("投票失败");
        }

        const payload = (await response.json()) as {
          answerId: string;
          voteScore: number;
          viewerVote: -1 | 0 | 1;
        };

        setItems((currentItems) =>
          currentItems.map((item) =>
            item.id === payload.answerId
              ? {
                  ...item,
                  voteScore: payload.voteScore,
                  viewerVote: payload.viewerVote,
                }
              : item,
          ),
        );
      } catch {
        setErrorMessage("投票没有成功，请稍后重试。");
      } finally {
        setPendingAnswerId(null);
      }
    });
  }

  function handleAccept(answerId: string) {
    if (!viewer.canAcceptAnswers) {
      setErrorMessage("只有提问者或管理员可以采纳回答。");
      return;
    }

    setPendingAnswerId(answerId);
    setErrorMessage(null);
    startTransition(async () => {
      try {
        const response = await fetch(`/api/answers/${answerId}/accept`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("accept failed");
        }

        const payload = (await response.json()) as {
          answerId: string;
          isAccepted: boolean;
        };

        setItems((currentItems) =>
          currentItems.map((item) => ({
            ...item,
            isAccepted: item.id === payload.answerId ? payload.isAccepted : false,
          })),
        );
      } catch {
        setErrorMessage("采纳操作没有成功，请稍后重试。");
      } finally {
        setPendingAnswerId(null);
      }
    });
  }

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
        <span style={{ color: "var(--muted)", alignSelf: "end" }}>{items.length} 条</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <SortButton active={sortMode === "recommended"} onClick={() => setSortMode("recommended")}>
            推荐排序
          </SortButton>
          <SortButton active={sortMode === "votes"} onClick={() => setSortMode("votes")}>
            票数优先
          </SortButton>
          <SortButton active={sortMode === "latest"} onClick={() => setSortMode("latest")}>
            最新回复
          </SortButton>
        </div>
        <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          {viewer.canVote ? "可投票与互动" : "登录后可投票"}
        </span>
      </div>

      {errorMessage ? (
        <p style={{ margin: 0, color: "#b43a33", lineHeight: 1.7 }}>{errorMessage}</p>
      ) : null}

      <div style={{ display: "grid", gap: "12px" }}>
        {sortedAnswers.length > 0 ? (
          sortedAnswers.map((answer) => (
            <article
              key={answer.id}
              style={{
                borderRadius: "18px",
                border: "1px solid rgba(31, 79, 134, 0.08)",
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

              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <VoteButton
                    active={answer.viewerVote === 1}
                    disabled={pendingAnswerId === answer.id}
                    onClick={() => handleVote(answer.id, 1)}
                  >
                    顶
                  </VoteButton>
                  <span style={{ minWidth: "3ch", textAlign: "center", fontWeight: 700 }}>{answer.voteScore}</span>
                  <VoteButton
                    active={answer.viewerVote === -1}
                    disabled={pendingAnswerId === answer.id}
                    onClick={() => handleVote(answer.id, -1)}
                  >
                    踩
                  </VoteButton>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {viewer.canAcceptAnswers ? (
                    <VoteButton
                      active={answer.isAccepted}
                      disabled={pendingAnswerId === answer.id}
                      onClick={() => handleAccept(answer.id)}
                    >
                      {answer.isAccepted ? "取消采纳" : "采纳回答"}
                    </VoteButton>
                  ) : null}
                </div>
              </div>
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

function sortAnswers(items: DiscussionAnswerData[], sortMode: SortMode) {
  const copy = [...items];

  if (sortMode === "votes") {
    return copy.sort((left, right) => {
      if (right.voteScore !== left.voteScore) {
        return right.voteScore - left.voteScore;
      }

      return Number(new Date(right.createdAtValue)) - Number(new Date(left.createdAtValue));
    });
  }

  if (sortMode === "latest") {
    return copy.sort(
      (left, right) => Number(new Date(right.createdAtValue)) - Number(new Date(left.createdAtValue)),
    );
  }

  return copy.sort((left, right) => {
    if (left.isAccepted !== right.isAccepted) {
      return left.isAccepted ? -1 : 1;
    }

    if (right.voteScore !== left.voteScore) {
      return right.voteScore - left.voteScore;
    }

    return Number(new Date(right.createdAtValue)) - Number(new Date(left.createdAtValue));
  });
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

function SortButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderRadius: "999px",
        border: active ? "1px solid rgba(31, 79, 134, 0.18)" : "1px solid var(--border)",
        background: active ? "rgba(31, 79, 134, 0.08)" : "transparent",
        color: active ? "var(--accent)" : "var(--muted)",
        padding: "8px 12px",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function VoteButton({
  active,
  children,
  disabled,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        borderRadius: "12px",
        border: active ? "1px solid rgba(31, 79, 134, 0.2)" : "1px solid var(--border)",
        background: active ? "rgba(31, 79, 134, 0.08)" : "rgba(255,255,255,0.75)",
        color: active ? "var(--accent)" : "var(--text)",
        padding: "8px 12px",
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
}
