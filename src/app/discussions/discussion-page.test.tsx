import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    follow: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/discussions/queries", () => ({
  getDiscussionListData: vi.fn().mockResolvedValue({
    title: "讨论问答",
    summary: "测试讨论摘要",
    recommendedItems: [
      {
        slug: "discussion-1",
        href: "/discussions/discussion-1",
        title: "测试问题一",
        summary: "问题摘要一",
        status: "PROVISIONAL_CONCLUSION",
        statusLabel: "阶段性结论",
        statusDescription: "已经形成当前判断，但仍可能随着新证据更新。",
        conclusion: "测试结论一",
        evidenceCount: 2,
        answerCount: 3,
        countryLabel: "美国",
        countrySlug: "us",
        topicLabel: "数字化与 AI 监管",
        topicSlug: "digital-ai-regulation",
        updatedAtLabel: "1 小时前",
        reason: "匹配你关注的领域",
        score: 42,
      },
    ],
    items: [
      {
        slug: "discussion-1",
        href: "/discussions/discussion-1",
        title: "测试问题一",
        summary: "问题摘要一",
        status: "PROVISIONAL_CONCLUSION",
        statusLabel: "阶段性结论",
        statusDescription: "已经形成当前判断，但仍可能随着新证据更新。",
        conclusion: "测试结论一",
        evidenceCount: 2,
        answerCount: 3,
        countryLabel: "美国",
        topicLabel: "数字化与 AI 监管",
        updatedAtLabel: "1 小时前",
      },
      {
        slug: "discussion-2",
        href: "/discussions/discussion-2",
        title: "测试问题二",
        summary: "问题摘要二",
        status: "CONTROVERSIAL",
        statusLabel: "高争议",
        statusDescription: "观点分歧较大，建议先看证据再下结论。",
        conclusion: "测试结论二",
        evidenceCount: 1,
        answerCount: 1,
        countryLabel: "全球",
        topicLabel: "CMC 与生产",
        updatedAtLabel: "3 小时前",
      },
    ],
  }),
  getDiscussionPageData: vi.fn().mockResolvedValue({
    id: "discussion-1",
    slug: "discussion-1",
    question: {
      title: "测试问题一",
      summary: "问题摘要一",
      status: "PROVISIONAL_CONCLUSION",
      statusLabel: "阶段性结论",
      statusDescription: "已经形成当前判断，但仍可能随着新证据更新。",
      countryLabel: "美国",
      topicLabel: "数字化与 AI 监管",
      createdByLabel: "Demo User",
      createdAtLabel: "2 小时前",
      updatedAtLabel: "1 小时前",
    },
    conclusion: {
      summary: "测试结论一",
      evidenceNote: "测试提示",
      updatedByLabel: "Demo User",
      updatedAtLabel: "1 小时前",
    },
    evidence: [
      {
        id: "evidence-1",
        title: "官方原文",
        url: "https://example.com",
        note: "测试证据",
        label: "OFFICIAL",
        labelText: "官方原文",
      },
    ],
    controversy: {
      title: "争议焦点",
      summary: "测试争议摘要",
      points: ["测试争议 1", "测试争议 2"],
    },
    answers: [
      {
        id: "answer-1",
        authorId: "user-1",
        authorLabel: "测试作者",
        body: "测试回答内容",
        evidenceLabel: "ANALYSIS",
        evidenceLabelText: "权威解读",
        createdAtLabel: "刚刚",
        createdAtValue: "2026-04-01T10:00:00.000Z",
        isAccepted: true,
        voteScore: 5,
        viewerVote: 1,
      },
    ],
    relatedQuestions: [
      {
        slug: "discussion-2",
        href: "/discussions/discussion-2",
        title: "测试问题二",
        summary: "问题摘要二",
        status: "CONTROVERSIAL",
        statusLabel: "高争议",
        statusDescription: "观点分歧较大，建议先看证据再下结论。",
        conclusion: "测试结论二",
        evidenceCount: 1,
        answerCount: 1,
        countryLabel: "全球",
        topicLabel: "CMC 与生产",
        updatedAtLabel: "3 小时前",
        reason: "相关活跃问题",
        score: 18,
      },
    ],
    viewer: {
      isAuthenticated: true,
      canVote: true,
      canAcceptAnswers: true,
    },
  }),
}));

import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import DiscussionsPage from "./page";
import DiscussionDetailPage from "./[slug]/page";

const mockedCookies = vi.mocked(cookies);
const mockedGetServerSession = vi.mocked(getServerSession);
const mockedPrisma = vi.mocked(prisma, { deep: true });

describe("Discussion pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetServerSession.mockResolvedValue(null as never);
    mockedCookies.mockResolvedValue({
      get: vi.fn().mockReturnValue(undefined),
    } as never);
    mockedPrisma.user.findUnique.mockResolvedValue(null as never);
    mockedPrisma.follow.findMany.mockResolvedValue([] as never);
  });

  it("renders the discussion list page", async () => {
    render(await DiscussionsPage());

    expect(screen.getByRole("heading", { name: "讨论问答" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "为你推荐" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "问题列表" })).toBeInTheDocument();
    expect(screen.getAllByText("测试问题一")).toHaveLength(2);
    expect(screen.getByText("测试问题二")).toBeInTheDocument();
    expect(screen.getByText("匹配你关注的领域")).toBeInTheDocument();
  });

  it("renders the approved detail page structure in order", async () => {
    mockedGetServerSession.mockResolvedValue({
      user: {
        email: "demo@regscope.local",
        role: "USER",
      },
    } as never);
    mockedPrisma.user.findUnique.mockResolvedValue({ id: "user-1", role: "USER" } as never);

    render(await DiscussionDetailPage({ params: { slug: "discussion-1" } }));

    expect(screen.getByRole("heading", { name: "测试问题一" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "阶段性判断会随着新证据更新" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "按来源强度拆开看" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "把分歧和缺口单独挑出来" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "按证据标签优先看回复" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "继续看相近讨论" })).toBeInTheDocument();
    expect(screen.getByText("测试回答内容")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "取消采纳" })).toBeInTheDocument();
  });
});
