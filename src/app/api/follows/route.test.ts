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
    source: {
      findUnique: vi.fn(),
    },
    country: {
      findUnique: vi.fn(),
    },
    topic: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    follow: {
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/db";
import { DELETE, POST } from "./route";

const mockedGetToken = vi.mocked(getToken);
const mockedPrisma = vi.mocked(prisma, { deep: true });

afterEach(() => {
  vi.clearAllMocks();
});

function makeRequest(method: "POST" | "DELETE", body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/follows", {
    method,
    body: JSON.stringify(body),
  });
}

describe("follows route", () => {
  it("rejects anonymous requests", async () => {
    mockedGetToken.mockResolvedValue(null);

    const response = await POST(makeRequest("POST", { targetType: "SOURCE", slug: "fda" }));

    expect(response.status).toBe(401);
  });

  it("creates a follow for an authenticated user", async () => {
    mockedGetToken.mockResolvedValue({ email: "demo@regscope.local", name: "Demo User" } as never);
    mockedPrisma.user.upsert.mockResolvedValue({ id: "user-1" } as never);
    mockedPrisma.source.findUnique.mockResolvedValue({ id: "source-1", slug: "fda", name: "美国 FDA" } as never);
    mockedPrisma.follow.deleteMany.mockResolvedValue({ count: 0 } as never);
    mockedPrisma.follow.create.mockResolvedValue({ id: "follow-1" } as never);

    const response = await POST(makeRequest("POST", { targetType: "SOURCE", slug: "fda" }));

    expect(response.status).toBe(200);
    expect(mockedPrisma.follow.create).toHaveBeenCalled();
  });

  it("removes a follow on DELETE", async () => {
    mockedGetToken.mockResolvedValue({ email: "demo@regscope.local", name: "Demo User" } as never);
    mockedPrisma.user.upsert.mockResolvedValue({ id: "user-1" } as never);
    mockedPrisma.topic.findUnique.mockResolvedValue({
      id: "topic-1",
      slug: "digital-ai-regulation",
      name: "数字化与 AI 监管",
    } as never);
    mockedPrisma.follow.deleteMany.mockResolvedValue({ count: 1 } as never);

    const response = await DELETE(
      makeRequest("DELETE", { targetType: "TOPIC", slug: "digital-ai-regulation" }),
    );

    expect(response.status).toBe(200);
    expect(mockedPrisma.follow.deleteMany).toHaveBeenCalled();
  });

  it("creates topic target on follow when topic slug is missing", async () => {
    mockedGetToken.mockResolvedValue({ email: "demo@regscope.local", name: "Demo User" } as never);
    mockedPrisma.user.upsert.mockResolvedValue({ id: "user-1" } as never);
    mockedPrisma.topic.findUnique.mockResolvedValue(null as never);
    mockedPrisma.topic.create.mockResolvedValue({
      id: "topic-2",
      slug: "clinical-trials-1",
      name: "方案设计",
    } as never);
    mockedPrisma.follow.deleteMany.mockResolvedValue({ count: 0 } as never);
    mockedPrisma.follow.create.mockResolvedValue({ id: "follow-2" } as never);

    const response = await POST(
      makeRequest("POST", { targetType: "TOPIC", slug: "clinical-trials-1", name: "方案设计" }),
    );

    expect(response.status).toBe(200);
    expect(mockedPrisma.topic.create).toHaveBeenCalled();
    expect(mockedPrisma.follow.create).toHaveBeenCalled();
  });

  it("keeps DELETE idempotent when topic slug does not exist", async () => {
    mockedGetToken.mockResolvedValue({ email: "demo@regscope.local", name: "Demo User" } as never);
    mockedPrisma.user.upsert.mockResolvedValue({ id: "user-1" } as never);
    mockedPrisma.topic.findUnique.mockResolvedValue(null as never);

    const response = await DELETE(
      makeRequest("DELETE", { targetType: "TOPIC", slug: "clinical-trials-1" }),
    );

    expect(response.status).toBe(200);
    expect(mockedPrisma.follow.deleteMany).not.toHaveBeenCalled();
  });
});
