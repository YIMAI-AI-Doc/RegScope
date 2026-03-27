import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    user: {
      upsert: vi.fn(),
    },
    follow: {
      findMany: vi.fn(),
    },
  },
}));

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import FollowCenterPage from "./page";

const mockedGetServerSession = vi.mocked(getServerSession);
const mockedRedirect = vi.mocked(redirect);
const mockedPrisma = vi.mocked(prisma, { deep: true });
const redirectSignal = new Error("NEXT_REDIRECT");

beforeEach(() => {
  vi.clearAllMocks();
  mockedRedirect.mockImplementation(() => {
    throw redirectSignal;
  });
});

describe("FollowCenterPage", () => {
  it("redirects anonymous users to sign in", async () => {
    mockedGetServerSession.mockResolvedValue(null as never);

    await expect(FollowCenterPage()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockedRedirect).toHaveBeenCalledWith("/api/auth/signin?callbackUrl=%2Fme%2Ffollows");
  });

  it("renders followed sources, countries, and topics for a logged-in user", async () => {
    mockedGetServerSession.mockResolvedValue({
      user: {
        email: "demo@regscope.local",
        name: "Demo User",
        role: "USER",
      },
    } as never);

    mockedPrisma.user.upsert.mockResolvedValue({ id: "user-1" } as never);
    mockedPrisma.follow.findMany.mockResolvedValue([
      {
        id: "follow-1",
        targetType: "SOURCE",
        source: { slug: "fda", name: "美国 FDA", description: "FDA", feedUrl: "https://example.com" },
        country: null,
        topic: null,
      },
      {
        id: "follow-2",
        targetType: "COUNTRY",
        source: null,
        country: { slug: "us", name: "美国", region: "北美" },
        topic: null,
      },
      {
        id: "follow-3",
        targetType: "TOPIC",
        source: null,
        country: null,
        topic: { slug: "digital-ai-regulation", name: "数字化与 AI 监管", level: 1 },
      },
    ] as never);

    render(await FollowCenterPage());

    expect(screen.getByRole("heading", { name: "关注中心" })).toBeInTheDocument();
    expect(screen.getByText("美国 FDA")).toBeInTheDocument();
    expect(screen.getByText("美国")).toBeInTheDocument();
    expect(screen.getByText("数字化与 AI 监管")).toBeInTheDocument();
  });
});
