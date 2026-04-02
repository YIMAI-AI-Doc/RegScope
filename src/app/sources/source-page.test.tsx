import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/content/queries", () => ({
  getSourceDirectoryData: vi.fn().mockResolvedValue({
    title: "官方来源",
    summary: "测试官方来源摘要",
    cards: [
      {
        slug: "source-1",
        href: "/sources/source-1",
        label: "测试来源",
        note: "测试说明",
        badge: "RSS",
        summary: "测试来源卡片摘要",
      },
    ],
    latestContent: [
      {
        slug: "content-1",
        href: "/content/content-1",
        title: "测试最新内容",
        summary: "测试内容摘要",
        sourceName: "测试来源",
        countryName: "测试国家",
        topicName: "测试领域",
        contentTypeLabel: "Policy",
        publishedAtLabel: "1 小时前",
        accent: "teal",
      },
    ],
    relatedDiscussions: [
      {
        slug: "discussion-1",
        href: "/feed?query=%E6%B5%8B%E8%AF%95%E8%AE%A8%E8%AE%BA",
        title: "测试讨论",
        summary: "测试讨论摘要",
        status: "讨论中",
        conclusion: "测试结论",
        evidenceCount: 2,
        answerCount: 3,
        updatedAtLabel: "刚刚",
      },
    ],
  }),
}));

import SourcesPage from "./page";

describe("SourcesPage", () => {
  it("renders source cards, latest content, and related discussions", async () => {
    render(await SourcesPage());

    expect(screen.getByRole("heading", { name: "官方来源" })).toBeInTheDocument();
    expect(screen.getByText("测试来源卡片摘要")).toBeInTheDocument();
    expect(screen.getAllByText("测试最新内容").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "预览 测试最新内容" })).toBeInTheDocument();
    expect(screen.getByText("测试内容摘要")).toBeInTheDocument();
    expect(screen.getByText("测试讨论")).toBeInTheDocument();
  });
});
