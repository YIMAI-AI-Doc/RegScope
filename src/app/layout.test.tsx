import "@testing-library/jest-dom/vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    follow: { count: vi.fn().mockResolvedValue(0) },
    answer: { count: vi.fn().mockResolvedValue(0) },
    discussion: { count: vi.fn().mockResolvedValue(0) },
  },
}));

vi.mock("@/components/layout/account-menu", () => ({
  AccountMenu: () => <div>账户入口</div>,
}));

import { SiteHeader } from "@/components/layout/site-header";

describe("SiteHeader", () => {
  it("renders the Chinese primary navigation", async () => {
    render(await SiteHeader());

    expect(screen.getByRole("navigation", { name: "主导航" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "首页" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "情报搜索" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "领域订阅" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "讨论问答" })).toBeInTheDocument();
    expect(screen.getByLabelText("全球医药法规情报平台")).toBeInTheDocument();
  });
});
