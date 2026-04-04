import "@testing-library/jest-dom/vitest";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeIntelligenceSection } from "@/components/home/home-intelligence-section";
import type { IntelligenceCardData } from "@/lib/content/queries";

function buildCard(index: number): IntelligenceCardData {
  return {
    slug: `card-${index}`,
    href: `/content/card-${index}`,
    title: `测试资讯卡片 ${String(index).padStart(2, "0")}`,
    summary: `测试摘要 ${index}`,
    sourceName: `测试来源 ${index}`,
    countryName: "测试国家",
    topicName: "测试领域",
    contentTypeLabel: "Policy",
    publishedAtLabel: `${index} 小时前`,
    accent: index % 2 === 0 ? "blue" : "teal",
  };
}

describe("HomeIntelligenceSection", () => {
  it("rotates homepage intelligence cards in batches", () => {
    render(
      <HomeIntelligenceSection
        hotCluster={[
          {
            rank: 1,
            href: "/content/hot-1",
            title: "热榜测试条目",
            kind: "intelligence",
            kindLabel: "情报",
            meta: "测试来源 · 1 小时前",
            heatLabel: "热度 99",
          },
        ]}
        items={Array.from({ length: 30 }, (_, index) => buildCard(index + 1))}
        dailyQuestion={null}
      />,
    );

    expect(screen.getByRole("button", { name: "换一换首页情报卡片" })).toBeInTheDocument();
    expect(screen.getAllByText("测试资讯卡片 08").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("测试资讯卡片 30")).toHaveLength(0);

    fireEvent.click(screen.getByRole("button", { name: "换一换首页情报卡片" }));

    expect(screen.queryAllByText("测试资讯卡片 08")).toHaveLength(0);
    expect(screen.getAllByText("测试资讯卡片 30").length).toBeGreaterThan(0);
  });
});
