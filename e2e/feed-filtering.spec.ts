import { expect, test } from "@playwright/test";

test("feed page reflects active query filters", async ({ page }) => {
  await page.goto("/feed?topic=digital-ai-regulation&country=us");

  await expect(page.getByRole("heading", { name: "快速筛选全球医药监管更新" })).toBeVisible();
  await expect(page.getByRole("link", { name: "数字化与 AI 监管 9" })).toBeVisible();
  await expect(page.getByRole("link", { name: "美国 北美" })).toBeVisible();
  await expect(page.getByText("结果")).toBeVisible();
});
