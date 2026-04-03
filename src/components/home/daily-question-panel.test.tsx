import "@testing-library/jest-dom/vitest";
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DailyQuestionPanel } from "./daily-question-panel";

const baseQuestion = {
  dateKey: "2026-04-04",
  dateLabel: "2026 年 4 月 4 日",
  sequence: 1,
  typeLabel: "单选题",
  difficultyLabel: "简单",
  prompt: "测试每日一题题干",
  options: [
    { key: "A" as const, text: "选项 A" },
    { key: "B" as const, text: "选项 B" },
  ],
  allowsMultiple: false,
  hasAnswered: false,
  selectedOption: null,
  isCorrect: null,
  correctOption: null,
  legalBasis: null,
  explanation: null,
  stats: null,
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("DailyQuestionPanel", () => {
  it("refreshes daily question state after login and allows answering", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ...baseQuestion,
        canAnswer: true,
        loginRequired: false,
        hasAnswered: true,
        selectedOption: "A",
        isCorrect: true,
        correctOption: "A",
        legalBasis: "法规依据",
        explanation: "解析内容",
        stats: {
          correctCount: 1,
          incorrectCount: 0,
          totalCount: 1,
          correctRatio: 100,
          incorrectRatio: 0,
        },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { rerender } = render(
      <DailyQuestionPanel
        hotCluster={[]}
        initialQuestion={{
          ...baseQuestion,
          canAnswer: false,
          loginRequired: true,
          statusNote: "登录后作答",
        }}
      />,
    );

    expect(screen.getByText("登录后作答")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "确认作答" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /A 选项 A/ })).toBeDisabled();

    rerender(
      <DailyQuestionPanel
        hotCluster={[]}
        initialQuestion={{
          ...baseQuestion,
          canAnswer: true,
          loginRequired: false,
        }}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText("登录后作答")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "确认作答" })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /A 选项 A/ }));
    fireEvent.click(screen.getByRole("button", { name: "确认作答" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/daily-question/answer", expect.any(Object));
    });
    expect(await screen.findByText("回答正确")).toBeInTheDocument();
  });
});
