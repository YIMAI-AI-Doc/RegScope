import "@testing-library/jest-dom/vitest";
import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

import { AccountMenu } from "./account-menu";

describe("AccountMenu", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("keeps the hover panel open for 300ms after mouse leave", () => {
    const { container } = render(
      <AccountMenu
        viewer={{
          isAuthenticated: true,
          name: "demo",
          email: "demo@regscope.local",
          role: "USER",
        }}
        stats={{
          followCount: 4,
          answerCount: 3,
          discussionCount: 5,
        }}
      />,
    );

    const wrapper = container.querySelector(".account-menu");
    expect(wrapper).not.toBeNull();

    fireEvent.mouseEnter(wrapper!);
    expect(screen.getByRole("menu", { name: "账户面板" })).toBeInTheDocument();

    fireEvent.mouseLeave(wrapper!);
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(screen.getByRole("menu", { name: "账户面板" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByRole("menu", { name: "账户面板" })).not.toBeInTheDocument();
  });
});
