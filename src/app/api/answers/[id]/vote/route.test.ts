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
    answer: {
      findUnique: vi.fn(),
    },
    answerVote: {
      upsert: vi.fn(),
      deleteMany: vi.fn(),
      findMany: vi.fn(),
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

describe("answer vote route", () => {
  it("stores a vote and returns the new score", async () => {
    mockedGetToken.mockResolvedValue({ email: "demo@regscope.local" } as never);
    mockedPrisma.user.upsert.mockResolvedValue({ id: "user-1" } as never);
    mockedPrisma.answer.findUnique.mockResolvedValue({ id: "answer-1" } as never);
    mockedPrisma.answerVote.upsert.mockResolvedValue({ id: "vote-1" } as never);
    mockedPrisma.answerVote.findMany.mockResolvedValue([
      { userId: "user-1", value: 1 },
      { userId: "user-2", value: 1 },
    ] as never);

    const response = await POST(
      new NextRequest("http://localhost/api/answers/answer-1/vote", {
        method: "POST",
        body: JSON.stringify({ value: 1 }),
      }),
      { params: { id: "answer-1" } },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      answerId: "answer-1",
      voteScore: 2,
      viewerVote: 1,
    });
  });
});
