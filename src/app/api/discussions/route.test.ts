import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  getAuthSecret: vi.fn(() => "test-secret"),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    user: {
      upsert: vi.fn(),
    },
    country: {
      findUnique: vi.fn(),
    },
    topic: {
      findUnique: vi.fn(),
    },
    discussion: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/pets/grant-points", () => ({
  grantPetPoints: vi.fn(),
}));

import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/db";
import { grantPetPoints } from "@/lib/pets/grant-points";
import { POST } from "./route";

const mockedGetToken = vi.mocked(getToken);
const mockedPrisma = vi.mocked(prisma, { deep: true });
const mockedGrantPetPoints = vi.mocked(grantPetPoints);

afterEach(() => {
  vi.clearAllMocks();
});

describe("discussion route", () => {
  it("creates a discussion and grants divine beast points", async () => {
    mockedGetToken.mockResolvedValue({ email: "demo@regscope.local", name: "Demo User" } as never);
    mockedPrisma.user.upsert.mockResolvedValue({ id: "user-1", role: "USER" } as never);
    mockedPrisma.discussion.create.mockResolvedValue({
      id: "discussion-1",
      slug: "discussion-1",
      status: "OPEN",
    } as never);

    const response = await POST(
      new NextRequest("http://localhost/api/discussions", {
        method: "POST",
        body: JSON.stringify({
          title: "测试讨论标题已经足够长",
          summary: "这是一个满足长度要求的测试讨论摘要。",
        }),
      }),
    );

    expect(response.status).toBe(201);
    expect(mockedGrantPetPoints).toHaveBeenCalledWith({
      userId: "user-1",
      eventType: "DISCUSSION_POST",
      sourceId: "discussion-1",
      sourceType: "DISCUSSION",
    });
  });
});
