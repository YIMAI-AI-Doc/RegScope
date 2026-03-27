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
    officialSources: [
      { slug: "fda", href: "/sources/fda", label: "美国 FDA", note: "官方监管机构", badge: "RSS" },
    ],
    topicCards: [
      { slug: "ai", href: "/topics/ai", label: "数字化与 AI 监管", note: "高关注订阅", badge: "9" },
    ],
    countryCards: [
      { slug: "us", href: "/countries/us", label: "美国", note: "FDA 追踪", badge: "北美" },
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
    trending: [
      { slug: "trend-1", href: "/countries/us", label: "美国 FDA", note: "12 条更新", badge: "热点" },
    ],
  }),
}));

import HomePage from "./page";

describe("HomePage", () => {
  it("renders the approved homepage sections", async () => {
    render(await HomePage());

    expect(screen.getByText("今日监管预警")).toBeInTheDocument();
    expect(screen.getByText("测试资讯卡片")).toBeInTheDocument();
    expect(screen.getByText("官方来源")).toBeInTheDocument();
    expect(screen.getByText("精选讨论摘要")).toBeInTheDocument();
    expect(screen.getByText("测试讨论摘要")).toBeInTheDocument();
    expect(screen.getByText("测试结论")).toBeInTheDocument();
    expect(screen.getByText("待讨论")).toBeInTheDocument();
    expect(screen.getByText("3 条回答 · 2 条证据")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "测试讨论" })).toHaveAttribute(
      "href",
      "/discussions/discussion-1",
    );
    expect(screen.getByText("趋势榜单")).toBeInTheDocument();
  });
});
