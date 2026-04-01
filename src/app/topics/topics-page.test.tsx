import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/content/queries", () => ({
  getTopicDirectoryData: vi.fn().mockResolvedValue({
    title: "领域订阅",
    summary: "测试领域订阅摘要",
    topicGroups: [
      {
        slug: "topic-group-1",
        label: "测试大领域",
        description: "测试大领域说明",
        children: [
          {
            slug: "topic-1",
            href: "/topics/topic-1",
            label: "测试小领域",
            note: "测试说明",
            badge: "9",
            summary: "测试领域卡片摘要",
          },
        ],
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
        accent: "blue",
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

import TopicsPage from "./page";

describe("TopicsPage", () => {
  it("renders topic browser, latest content, and related discussions", async () => {
    render(await TopicsPage());

    expect(screen.getByRole("heading", { name: "领域订阅" })).toBeInTheDocument();
    expect(screen.getAllByText("测试大领域")).toHaveLength(2);
    expect(screen.getByText("测试领域卡片摘要")).toBeInTheDocument();
    expect(screen.getByText("测试最新内容")).toBeInTheDocument();
    expect(screen.getByText("测试讨论")).toBeInTheDocument();
  });
});
