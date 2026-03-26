import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/content/queries", () => ({
  getFeedPageData: vi.fn().mockResolvedValue({
    items: [
      {
        slug: "feed-1",
        href: "/content/feed-1",
        title: "测试快讯",
        summary: "测试摘要",
        sourceName: "测试来源",
        countryName: "测试国家",
        topicName: "测试领域",
        contentTypeLabel: "Policy",
        publishedAtLabel: "1 小时前",
        accent: "teal",
      },
    ],
    total: 1,
    filters: {
      countries: [
        { slug: "all-countries", href: "/feed", label: "全部国家", note: "默认", badge: "" },
      ],
      sources: [
        { slug: "all-sources", href: "/feed", label: "全部来源", note: "默认", badge: "" },
      ],
      topics: [
        { slug: "all-topics", href: "/feed", label: "全部领域", note: "默认", badge: "" },
      ],
      contentTypes: [
        { slug: "all-types", href: "/feed", label: "全部类型", note: "默认", badge: "" },
      ],
      timeRanges: [
        { slug: "all-time", href: "/feed", label: "全部时间", note: "默认", badge: "" },
      ],
    },
  }),
}));

import FeedPage from "./page";

describe("FeedPage", () => {
  it("renders the feed filters and intelligence cards", async () => {
    render(await FeedPage({ searchParams: { topic: "digital-ai-regulation" } }));

    expect(screen.getByText("筛选情报")).toBeInTheDocument();
    expect(screen.getByText("测试快讯")).toBeInTheDocument();
    expect(screen.getByText("结果")).toBeInTheDocument();
  });
});
