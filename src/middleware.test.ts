import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn(),
}));

import { getToken } from "next-auth/jwt";
import { middleware } from "../middleware";

const mockedGetToken = vi.mocked(getToken);

afterEach(() => {
  vi.clearAllMocks();
  delete process.env.REGSCOPE_INGEST_SECRET;
});

describe("middleware", () => {
  it("redirects anonymous users away from the follow center", async () => {
    mockedGetToken.mockResolvedValue(null);

    const response = await middleware(new NextRequest("http://localhost/me/follows"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/api/auth/signin");
    expect(response.headers.get("location")).toContain("callbackUrl=%2Fme%2Ffollows");
  });

  it("blocks anonymous write API requests", async () => {
    mockedGetToken.mockResolvedValue(null);

    const response = await middleware(
      new NextRequest("http://localhost/api/follows", { method: "POST" }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("allows authenticated write API requests", async () => {
    mockedGetToken.mockResolvedValue({ email: "demo@regscope.local" } as never);

    const response = await middleware(
      new NextRequest("http://localhost/api/discussions/discussion-1/answers", { method: "POST" }),
    );

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("allows ingest requests with the shared secret header", async () => {
    process.env.REGSCOPE_INGEST_SECRET = "test-ingest-secret";

    const response = await middleware(
      new NextRequest("http://localhost/api/ingest/run", {
        method: "POST",
        headers: { "x-regscope-ingest-secret": "test-ingest-secret" },
      }),
    );

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});
