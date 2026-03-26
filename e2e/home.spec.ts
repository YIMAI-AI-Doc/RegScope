import { expect, test } from "@playwright/test";

test("homepage surfaces the core RegScope sections", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "全球医药监管情报，按主题订阅，按结论阅读。" })).toBeVisible();
  await expect(page.getByText("今日监管预警")).toBeVisible();
  await expect(page.getByText("精选讨论摘要")).toBeVisible();
  await expect(page.getByText("趋势榜单")).toBeVisible();
});
