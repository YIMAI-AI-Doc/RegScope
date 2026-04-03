import { expect, test } from "@playwright/test";

test("homepage surfaces the core RegScope sections", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("searchbox", { name: "全站搜索关键词" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "热榜 top10" })).toBeVisible();
  await expect(page.getByText("精选推荐")).toBeVisible();
  await expect(page.getByRole("link", { name: "更多讨论问答" })).toBeVisible();
});
