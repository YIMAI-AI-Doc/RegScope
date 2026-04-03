import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn().mockResolvedValue({
    user: { id: "user-1" },
  }),
}));

vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

vi.mock("@/lib/content/queries", () => ({
  getHomepageData: vi.fn().mockResolvedValue({
    alert: {
      title: "今日监管预警",
      summary: "测试告警摘要",
      meta: "测试元信息",
    },
    hotCluster: [
      {
        rank: 1,
        href: "/content/card-1",
        title: "热榜测试条目",
        kind: "intelligence",
        kindLabel: "情报",
        meta: "测试来源 · 1 小时前",
        heatLabel: "热度 88",
      },
    ],
    featuredCards: [
      {
        slug: "card-1",
        href: "/content/card-1",
        title: "测试资讯卡片",
        summary: "测试摘要",
        sourceName: "测试来源",
        countryName: "测试国家",
        topicName: "测试领域",
        contentTypeLabel: "Policy",
        publishedAtLabel: "1 小时前",
        accent: "blue",
      },
    ],
    accountCards: [
      {
        slug: "fda",
        href: "/sources/fda",
        label: "美国 FDA",
        note: "官方监管机构",
        summary: "测试账号摘要",
        badge: "RSS",
        targetType: "SOURCE",
        recentCountLabel: "12 条更新",
      },
    ],
    topicGroups: [
      {
        slug: "digital-ai-regulation",
        label: "数字化与 AI 监管",
        description: "测试大领域说明",
        children: [
          {
            slug: "subtopic-1",
            href: "/feed?topic=digital-ai-regulation&query=AI",
            label: "AI 医药研发",
            note: "小领域",
            badge: "1",
            summary: "测试小领域摘要",
          },
        ],
      },
    ],
    discussions: [
      {
        slug: "discussion-1",
        href: "/discussions/discussion-1",
        title: "测试讨论",
        summary: "测试讨论摘要",
        status: "待讨论",
        conclusion: "测试结论",
        evidenceCount: 2,
        answerCount: 3,
        updatedAtLabel: "刚刚",
      },
    ],
  }),
}));

vi.mock("@/lib/quiz/queries", () => ({
  getDailyQuizPanelData: vi.fn().mockResolvedValue({
    dateKey: "2026-04-04",
    dateLabel: "2026 年 4 月 4 日",
    sequence: 1,
    typeLabel: "单选题",
    difficultyLabel: "简单",
    prompt: "测试每日一题题干",
    options: [
      { key: "A", text: "选项 A" },
      { key: "B", text: "选项 B" },
      { key: "C", text: "选项 C" },
      { key: "D", text: "选项 D" },
    ],
    allowsMultiple: false,
    canAnswer: true,
    loginRequired: false,
    hasAnswered: false,
    selectedOption: null,
    isCorrect: null,
    correctOption: null,
    legalBasis: null,
    explanation: null,
    stats: null,
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

import HomePage from "./page";

describe("HomePage", () => {
  it("renders the approved homepage sections", async () => {
    render(await HomePage());

    expect(screen.getByRole("tab", { name: "热榜 top10" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "每日一题" })).toBeInTheDocument();
    expect(screen.getByText("热榜测试条目")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "精选推荐" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "更多讨论问答" })).toBeInTheDocument();
    expect(screen.getAllByText("测试资讯卡片").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/测试来源/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/1 小时前/).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "预览 测试资讯卡片" })).toBeInTheDocument();
    expect(screen.getByText("内容预览")).toBeInTheDocument();
    expect(screen.getByText("测试讨论摘要")).toBeInTheDocument();
    expect(screen.getByText("测试结论")).toBeInTheDocument();
  });
});
