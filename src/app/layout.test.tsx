import "@testing-library/jest-dom/vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";

describe("SiteHeader", () => {
  it("renders the Chinese primary navigation", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("navigation", { name: "主导航" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "首页" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "情报快讯" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "讨论问答" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "我的关注" })).toBeInTheDocument();
  });
});
