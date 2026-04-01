import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    user: {
      upsert: vi.fn(),
    },
    discussion: {
      findUnique: vi.fn(),
    },
    discussionView: {
      upsert: vi.fn(),
    },
  },
}));

import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/db";
import { POST } from "./route";

const mockedGetToken = vi.mocked(getToken);
const mockedPrisma = vi.mocked(prisma, { deep: true });

afterEach(() => {
  vi.clearAllMocks();
});

describe("discussion view route", () => {
  it("returns anonymous when no session exists", async () => {
    mockedGetToken.mockResolvedValue(null);

    const response = await POST(new NextRequest("http://localhost/api/discussions/ai-guidance-impact/view"), {
      params: { slug: "ai-guidance-impact" },
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: "anonymous" });
  });

  it("tracks a discussion view for an authenticated user", async () => {
    mockedGetToken.mockResolvedValue({ email: "demo@regscope.local" } as never);
    mockedPrisma.user.upsert.mockResolvedValue({ id: "user-1" } as never);
    mockedPrisma.discussion.findUnique.mockResolvedValue({ id: "discussion-1" } as never);
    mockedPrisma.discussionView.upsert.mockResolvedValue({ id: "view-1" } as never);

    const response = await POST(new NextRequest("http://localhost/api/discussions/ai-guidance-impact/view"), {
      params: { slug: "ai-guidance-impact" },
    });

    expect(response.status).toBe(200);
    expect(mockedPrisma.discussionView.upsert).toHaveBeenCalled();
  });
});
