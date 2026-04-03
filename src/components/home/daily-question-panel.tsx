"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import type { HotClusterItemData } from "@/lib/content/queries";
import type { DailyQuizOptionKey, DailyQuizPanelData } from "@/lib/quiz/queries";

type DailyQuestionPanelProps = {
  hotCluster: HotClusterItemData[];
  initialQuestion: DailyQuizPanelData | null;
};

function formatSelection(value: string | null) {
  if (!value) {
    return "未作答";
  }

  return value.split("").join("、");
}

export function DailyQuestionPanel({ hotCluster, initialQuestion }: DailyQuestionPanelProps) {
  const [activeTab, setActiveTab] = useState<"hot" | "daily">(hotCluster.length > 0 ? "hot" : "daily");
  const [question, setQuestion] = useState(initialQuestion);
  const [selectedOptions, setSelectedOptions] = useState<DailyQuizOptionKey[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setQuestion(initialQuestion);
    setSelectedOptions([]);
    setError(null);
  }, [
    initialQuestion?.dateKey,
    initialQuestion?.canAnswer,
    initialQuestion?.hasAnswered,
    initialQuestion?.selectedOption,
  ]);

  function handleSelect(option: DailyQuizOptionKey) {
    if (!question || question.hasAnswered || !question.canAnswer || isPending) {
      return;
    }

    setSelectedOptions((current) => {
      if (question.allowsMultiple) {
        return current.includes(option) ? current.filter((item) => item !== option) : [...current, option].sort();
      }

      return current[0] === option ? [] : [option];
    });
  }

  async function handleAnswer() {
    setError(null);
    if (selectedOptions.length === 0) {
      setError("请先选择答案");
      return;
    }

    try {
      const response = await fetch("/api/daily-question/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selection: selectedOptions }),
      });

      const payload = (await response.json()) as DailyQuizPanelData | { error?: string };
      if (!response.ok) {
        setError(typeof payload.error === "string" ? payload.error : "提交失败，请稍后重试");
        return;
      }

      startTransition(() => {
        setQuestion(payload as DailyQuizPanelData);
        setSelectedOptions([]);
      });
    } catch {
      setError("提交失败，请检查网络后重试");
    }
  }

  useEffect(() => {
    if (activeTab !== "daily" || question) {
      return;
    }

    setIsLoadingQuestion(true);
    void fetch("/api/daily-question", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as DailyQuizPanelData | { error?: string };
        if (!response.ok) {
          throw new Error(typeof payload.error === "string" ? payload.error : "当前暂无题目");
        }

        startTransition(() => {
          setQuestion(payload as DailyQuizPanelData);
        });
      })
      .catch((fetchError) => {
        setError(fetchError instanceof Error ? fetchError.message : "当前暂无题目");
      })
      .finally(() => {
        setIsLoadingQuestion(false);
      });
  }, [activeTab, question, startTransition]);

  useEffect(() => {
    if (activeTab !== "daily" || !question?.hasAnswered) {
      return;
    }

    const timer = window.setInterval(async () => {
      try {
        const response = await fetch("/api/daily-question", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as DailyQuizPanelData;
        startTransition(() => {
          setQuestion(payload);
        });
      } catch {
        // Ignore transient polling errors and keep the current stats visible.
      }
    }, 30000);

    return () => window.clearInterval(timer);
  }, [activeTab, question?.hasAnswered, startTransition]);

  return (
    <article className="homepage-hot-cluster">
      <div className="homepage-hot-header">
        <div className="homepage-hot-tabset" role="tablist" aria-label="首页焦点面板">
          <button
            type="button"
            role="tab"
            className={`homepage-hot-tab ${activeTab === "hot" ? "is-active" : ""}`}
            aria-selected={activeTab === "hot"}
            onClick={() => setActiveTab("hot")}
          >
            热榜 top10
          </button>
          <button
            type="button"
            role="tab"
            className={`homepage-hot-tab ${activeTab === "daily" ? "is-active" : ""}`}
            aria-selected={activeTab === "daily"}
            onClick={() => setActiveTab("daily")}
          >
            每日一题
          </button>
        </div>
      </div>

      {activeTab === "hot" ? (
        <div className="homepage-hot-list">
          {hotCluster.slice(0, 10).map((item, index) => (
            <Link key={`${item.kind}-${item.rank}-${item.href}`} href={item.href} className="homepage-hot-item">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                <span className="homepage-hot-rank">{String(index + 1).padStart(2, "0")}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, flex: 1 }}>
                  <strong className="homepage-hot-title">{item.title}</strong>
                  <span className="homepage-hot-kind">{item.kindLabel}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : isLoadingQuestion ? (
        <section className="daily-question-empty" aria-label="每日一题">
          <p>正在载入今日题目...</p>
        </section>
      ) : question ? (
        <section className="daily-question-card" aria-label="每日一题">
          <div className="daily-question-head">
            <div style={{ display: "grid", gap: "6px" }}>
              <span className="daily-question-kicker">
                {question.typeLabel} #{question.sequence}
              </span>
              <p className="daily-question-date">{question.dateLabel}</p>
            </div>
            {question.difficultyLabel ? <span className="daily-question-difficulty">{question.difficultyLabel}</span> : null}
          </div>

          <h3 className="daily-question-title">{question.prompt}</h3>

          <div className="daily-question-options">
            {question.options.map((option) => {
              const isSelected = question.hasAnswered
                ? question.selectedOption?.includes(option.key) ?? false
                : selectedOptions.includes(option.key);
              const isCorrectOption = question.hasAnswered && (question.correctOption?.includes(option.key) ?? false);
              const isWrongSelection =
                question.hasAnswered && (question.selectedOption?.includes(option.key) ?? false) && !question.correctOption?.includes(option.key);

              return (
                <button
                  key={option.key}
                  type="button"
                  className={[
                    "daily-question-option",
                    isSelected ? "is-selected" : "",
                    isCorrectOption ? "is-correct" : "",
                    isWrongSelection ? "is-wrong" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  disabled={!question.canAnswer || question.hasAnswered || isPending}
                  onClick={() => handleSelect(option.key)}
                >
                  <span className="daily-question-option-key">{option.key}</span>
                  <span className="daily-question-option-text">{option.text}</span>
                </button>
              );
            })}
          </div>

          {question.canAnswer && !question.hasAnswered ? (
            <div className="daily-question-actions">
              <button
                type="button"
                className="daily-question-submit"
                disabled={selectedOptions.length === 0 || isPending}
                onClick={() => void handleAnswer()}
              >
                {question.allowsMultiple ? "提交答案" : "确认作答"}
              </button>
            </div>
          ) : null}

          {!question.canAnswer && !question.hasAnswered && (question.loginRequired || question.statusNote) ? (
            <p className="daily-question-login-note">
              {question.loginRequired ? question.statusNote ?? "登录后作答" : question.statusNote}
            </p>
          ) : null}

          {error ? <p className="daily-question-error">{error}</p> : null}

          {question.hasAnswered ? (
            <div className="daily-question-result">
              <div className={`daily-question-result-banner ${question.isCorrect ? "is-correct" : "is-wrong"}`}>
                <strong>{question.isCorrect ? "回答正确" : "回答错误"}</strong>
                <span>
                  你的答案：{formatSelection(question.selectedOption)} · 正确答案：{formatSelection(question.correctOption)}
                </span>
              </div>

              <div className="daily-question-result-grid">
                <div className="daily-question-result-block">
                  <span className="daily-question-result-label">法规依据</span>
                  <p>{question.legalBasis}</p>
                </div>
                <div className="daily-question-result-block">
                  <span className="daily-question-result-label">解析</span>
                  <p>{question.explanation}</p>
                </div>
              </div>

              {question.stats ? (
                <div className="daily-question-stats">
                  <div className="daily-question-stats-header">
                    <strong>当日答题占比</strong>
                    <span>{question.stats.totalCount} 人已作答</span>
                  </div>
                  <div className="daily-question-stats-bar" aria-label="答对答错比例">
                    <span
                      className="daily-question-stats-correct"
                      style={{ width: `${question.stats.correctRatio}%` }}
                    />
                    <span
                      className="daily-question-stats-incorrect"
                      style={{ width: `${question.stats.incorrectRatio}%` }}
                    />
                  </div>
                  <div className="daily-question-stats-legend">
                    <span>答对 {question.stats.correctRatio}% · {question.stats.correctCount} 人</span>
                    <span>答错 {question.stats.incorrectRatio}% · {question.stats.incorrectCount} 人</span>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : (
        <section className="daily-question-empty" aria-label="每日一题">
          <p>当前暂无题目，请先导入题库。</p>
        </section>
      )}
    </article>
  );
}
