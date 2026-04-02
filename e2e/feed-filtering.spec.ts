import { expect, test } from "@playwright/test";

test("feed page reflects active query filters", async ({ page }) => {
  await page.goto("/feed?tab=intelligence&topic=digital-ai-regulation&country=us");

  await expect(page.getByRole("heading", { name: "RegScope 搜索结果" })).toBeVisible();
  await expect(page.getByRole("button", { name: "更多筛选" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "情报结果" })).toBeVisible();
  await expect(page.getByText("条情报结果")).toBeVisible();
});
