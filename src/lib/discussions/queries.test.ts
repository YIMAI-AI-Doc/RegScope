import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    discussion: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db";
import { getDiscussionListData, rankDiscussionListItems } from "./queries";

const mockedPrisma = vi.mocked(prisma, { deep: true });

afterEach(() => {
  vi.clearAllMocks();
});

describe("discussion queries", () => {
  it("maps database discussion records into list items without crashing", async () => {
    mockedPrisma.discussion.findMany.mockResolvedValue([
      {
        id: "discussion-1",
        slug: "ai-guidance-impact",
        title: "AI 指南对现有申报路径的影响是什么？",
        summary: "测试摘要",
        status: "PROVISIONAL_CONCLUSION",
        country: { slug: "us", name: "美国" },
        topic: { slug: "digital-ai-regulation", name: "数字化与 AI 监管" },
        createdBy: { name: "RegScope 编辑部", email: "demo@regscope.local" },
        createdAt: new Date("2026-04-01T08:00:00.000Z"),
        updatedAt: new Date("2026-04-01T10:00:00.000Z"),
        conclusion: {
          id: "conclusion-1",
          discussionId: "discussion-1",
          summary: "测试结论",
          evidenceNote: "测试提示",
          updatedById: "user-1",
          updatedAt: new Date("2026-04-01T10:00:00.000Z"),
          createdAt: new Date("2026-04-01T09:00:00.000Z"),
          updatedBy: { name: "Demo Analyst", email: "analyst@regscope.local" },
        },
        evidence: [
          {
            id: "evidence-1",
            discussionId: "discussion-1",
            title: "官方原文",
            url: "https://example.com",
            sourceLabel: "OFFICIAL",
            note: "测试证据",
            createdAt: new Date("2026-04-01T08:30:00.000Z"),
          },
        ],
        answers: [
          {
            id: "answer-1",
            discussionId: "discussion-1",
            authorId: "user-2",
            body: "测试回答",
            evidenceLabel: "ANALYSIS",
            isAccepted: true,
            createdAt: new Date("2026-04-01T09:30:00.000Z"),
            updatedAt: new Date("2026-04-01T09:30:00.000Z"),
            author: { name: "Reviewer", email: "reviewer@regscope.local" },
            votes: [
              { userId: "user-1", value: 1 },
              { userId: "user-2", value: 1 },
            ],
          },
        ],
        views: [
          { userId: "user-1", viewCount: 3, lastViewedAt: new Date("2026-04-01T10:00:00.000Z") },
        ],
      },
    ] as never);

    const data = await getDiscussionListData();

    expect(data.items).toHaveLength(1);
    expect(data.items[0]?.title).toBe("AI 指南对现有申报路径的影响是什么？");
    expect(data.items[0]?.conclusion).toBe("测试结论");
    expect(data.items[0]?.topicSlug).toBe("digital-ai-regulation");
  });

  it("prioritizes recent views and followed topics in ranking", () => {
    const ranked = rankDiscussionListItems(
      [
        {
          slug: "discussion-1",
          href: "/discussions/discussion-1",
          title: "问题一",
          summary: "摘要一",
          status: "OPEN",
          statusLabel: "待讨论",
          statusDescription: "仍在收集证据",
          conclusion: "结论一",
          evidenceCount: 1,
          answerCount: 1,
          countryLabel: "美国",
          countrySlug: "us",
          topicLabel: "数字化与 AI 监管",
          topicSlug: "digital-ai-regulation",
          updatedAtLabel: "刚刚",
        },
        {
          slug: "discussion-2",
          href: "/discussions/discussion-2",
          title: "问题二",
          summary: "摘要二",
          status: "PROVISIONAL_CONCLUSION",
          statusLabel: "阶段性结论",
          statusDescription: "已经形成阶段结论",
          conclusion: "结论二",
          evidenceCount: 2,
          answerCount: 2,
          countryLabel: "欧盟",
          countrySlug: "eu",
          topicLabel: "CMC 与生产",
          topicSlug: "cmc-and-manufacturing",
          updatedAtLabel: "1 小时前",
        },
      ],
      {
        recentDiscussionSlugs: ["discussion-1"],
        followedTopicSlugs: ["digital-ai-regulation"],
      },
    );

    expect(ranked.items[0]?.slug).toBe("discussion-1");
    expect(ranked.recommendedItems[0]?.reason).toContain("你刚看过");
  });
});
