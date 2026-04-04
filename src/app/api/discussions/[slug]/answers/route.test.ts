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
    discussion: {
      findUnique: vi.fn(),
    },
    answer: {
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

describe("discussion answers route", () => {
  it("creates an answer and grants comment points", async () => {
    mockedGetToken.mockResolvedValue({ email: "demo@regscope.local", name: "Demo User" } as never);
    mockedPrisma.user.upsert.mockResolvedValue({ id: "user-1", role: "USER" } as never);
    mockedPrisma.discussion.findUnique.mockResolvedValue({ id: "discussion-1" } as never);
    mockedPrisma.answer.create.mockResolvedValue({
      id: "answer-1",
      discussionId: "discussion-1",
      evidenceLabel: "UNVERIFIED",
    } as never);

    const response = await POST(
      new NextRequest("http://localhost/api/discussions/test-discussion/answers", {
        method: "POST",
        body: JSON.stringify({
          body: "这是一个满足长度要求的测试回答内容。",
        }),
      }),
      { params: { slug: "test-discussion" } },
    );

    expect(response.status).toBe(201);
    expect(mockedGrantPetPoints).toHaveBeenCalledWith({
      userId: "user-1",
      eventType: "COMMENT",
      sourceId: "answer-1",
      sourceType: "ANSWER",
    });
  });
});
