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
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    $transaction: vi.fn(),
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

describe("answer accept route", () => {
  it("lets the discussion owner accept an answer", async () => {
    mockedGetToken.mockResolvedValue({ email: "demo@regscope.local" } as never);
    mockedPrisma.user.upsert.mockResolvedValue({ id: "user-1", role: "USER" } as never);
    mockedPrisma.answer.findUnique.mockResolvedValue({
      id: "answer-1",
      isAccepted: false,
      discussion: {
        id: "discussion-1",
        createdById: "user-1",
      },
    } as never);
    mockedPrisma.answer.updateMany.mockResolvedValue({ count: 0 } as never);
    mockedPrisma.answer.update.mockResolvedValue({ id: "answer-1", isAccepted: true } as never);
    mockedPrisma.$transaction.mockResolvedValue([] as never);

    const response = await POST(
      new NextRequest("http://localhost/api/answers/answer-1/accept", { method: "POST" }),
      { params: { id: "answer-1" } },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      answerId: "answer-1",
      isAccepted: true,
    });
  });
});
