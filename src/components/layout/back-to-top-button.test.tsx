import "@testing-library/jest-dom/vitest";
import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BackToTopButton } from "./back-to-top-button";

describe("BackToTopButton", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0,
    });
    window.scrollTo = vi.fn();
  });

  it("shows after scrolling and returns to the top on click", () => {
    render(<BackToTopButton />);

    const button = screen.getByRole("button", { name: "回到顶部" });
    expect(button).toHaveAttribute("data-visible", "false");

    act(() => {
      Object.defineProperty(window, "scrollY", {
        configurable: true,
        writable: true,
        value: 640,
      });
      fireEvent.scroll(window);
    });

    expect(button).toHaveAttribute("data-visible", "true");

    fireEvent.click(button);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
