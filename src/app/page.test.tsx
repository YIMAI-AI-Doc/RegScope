import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

import HomePage from "./page";

describe("HomePage", () => {
  it("renders the approved homepage sections", async () => {
    render(await HomePage());

    expect(screen.getByRole("heading", { name: /站内热榜 Top10/ })).toBeInTheDocument();
    expect(screen.getByText("热榜测试条目")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "精选讨论摘要" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "进入讨论问答" })).toBeInTheDocument();
    expect(screen.getByText("测试资讯卡片")).toBeInTheDocument();
    expect(screen.getByText("测试来源")).toBeInTheDocument();
    expect(screen.getByText(/1 小时前/)).toBeInTheDocument();
    expect(screen.getByText("测试讨论摘要")).toBeInTheDocument();
    expect(screen.getByText("测试结论")).toBeInTheDocument();
  });
});
